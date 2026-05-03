---
layout: post
title: Running linux-only-binaries-under-freebsd
date: 2024-03-31
tags: [guides]
desc: Running Linux-only binaries under FreeBSD using its Linux binary compatibility tools and Jails
---

<script>
  import Image from '$components/images/image.svelte';
</script>

I've taken a real liking to FreeBSD lately, but my biggest initial annoyance was its lack of compatibility with Linux apps and tools I've grown accustomed to. 


Despite also being a Unix-like operating system, it isn't able to run many Linux binaries and programs. Spotify is one example I ran into while testing out FreeBSD as a desktop OS. Due to certain DRM library dependencies (*cough cough*, Widevine CDM), it's not able to run natively. This would be a deal-breaker for me, but luckily, there's a quick and rather easy workaround, using a virtualization concept called Jails, and FreeBSD's Linux binary compatibility.


## Jails & Linux Binary Compatibility

Jails are FreeBSD's approach to OS-level virtualization[^1]. Each Jail operates independently with its own file system, network stack, and process tree, and is isolated from the host and from other Jails. With much less overhead than full-blown virtual machines, they're perfect for running a Linux environment efficiently.


FreeBSD's Linux binary compatibility feature is the magic wand here - it emulates a Linux environment within a Jail, allowing you to run many Linux apps seamlessly. The environment I'll be setting up here, based on Ubuntu, provides the necessary libraries and components required to run many Linux-only binaries (not just Spotify, although that's what my focus was on here). Not everything works perfectly, however, and certain binaries or programs may require modifying the basic setup I detail in this article.


## Getting started

First, a quick note: throughout this guide, lines starting with `$` relate to our host BSD shell, while `/$` denotes commands to be run within the Jail.


First things first, let's enable Linux binary compatibility. Loading the necessary kernel modules is the first step:

- `linux`: The basic Linux compat layer, necessary for running Linux binaries on FreeBSD
- `linux64`: Specifically for 64-bit compat
- `fdescfs`: Used by Linux programs to access file descriptors in a UNIX-like manner\
- `linprocfs`: Emulates the Linux /proc filesystem, providing process and system information in a way Linux binaries will expect
- `tmpfs`: A temporary filesystem for creation of cache in RAM
- `linsysfs`: Emulates the Linux /sys filesystem, providing system and device information for Linux binaries, similar to linprocfs

```sh
$ kldload linux linux64 fdescfc linprocfs tmpfs linsysfs
```

This can be done manually at run-time but it's easy to persist this change across reboots by adding these all to `/boot/loader.conf`:

```sh
$ echo -e "linux_load=\"YES\"\nlinux64_load=\"YES\"\nfdescfs_load=\"YES\"\nlinprocfs_load=\"YES\"\ntmpfs_load=\"YES\"\nlinsysfs_load=\"YES\"" >> /boot/loader.conf
```


### Preparing the service script

Our goal is to keep things (relatively) simple. We'll create a script to manage the Ubuntu Jail, under `/usr/local/etc/rc.d/ubuntu`. It'll handle loading necessary modules and setting up the Jail's environment.

```sh
#!/bin/sh

# PROVIDE: ubuntu
# REQUIRE: archdep mountlate
# KEYWORD: nojail

# Import FreeBSD rc.subr scripting infra
. /etc/rc.subr

name="ubuntu"
desc="Ubuntu for Linux binary compat"
rcvar="ubuntu_enable"
start_cmd="${name}_start"
stop_cmd=":"

unmounted() {
  [ `stat -f "%d" "$1"` == `stat -f "%d" "$1/.."` -a `stat -f "%i" "$1"` != `stat -f "%i" "$1/.."` ]
}

ubuntu_start() {
  local _tmpdir

  # Load Linux & Linux64 compat modules
  load_kld -e 'linux(aout|elf)' linux
  if [ `sysctl -n hw.machine_arch` == "amd64" ]; then
    load_kld -e 'linux64elf' linux64
  fi

  # Update the Linux dynamic linker cache if needed
  if [ -x "/compat/ubuntu/sbin/ldconfigDisabled" ]; then
    _tmpdir=`mktemp -d -t linux-ldconfig`
    /compat/ubuntu/sbin/ldconfig -C ${_tmpdir}/ld.so.cache
    if ! cmp -s "${_tmpdir}/ld.so.cache" "/compat/ubuntu/etc/ld.so.cache"; then
      cat "${_tmpdir}/ld.so.cache" > "/compat/ubuntu/etc/ld.so.cache"
    fi
    rm -rf ${_tmpdir}
  fi

  # Load modules for proper terminal/device support
  load_kld pty

  # Set system compatibility brand for executables
  if [ `sysctl -ni kern.elf64.fallback_brand` -eq "-1" ]; then
    sysctl kern.elf64.fallback_brand=3 > /dev/null
  fi
  if [ `sysctl -ni kern.elf32.fallback_brand` -eq "-1" ]; then
    sysctl kern.elf32.fallback_brand=3 > /dev/null
  fi

  # Set the emulation path to the Ubuntu compat layer
  sysctl compat.linux.emul_path="/compat/ubuntu"

  # Mount necessary filesystems
  unmounted "/compat/ubuntu/dev" && (mount -o nocover -t devfs devfs "/compat/ubuntu/dev" || exit 1)
  unmounted "/compat/ubuntu/dev/fd" && (mount -o nocover,linrdlnk -t fdescfs fdescfs "/compat/ubuntu/dev/fd" || exit 1)
  unmounted "/compat/ubuntu/dev/shm" && (mount -o nocover,mode=1777 -t tmpfs tmpfs "/compat/ubuntu/dev/shm" || exit 1)
  unmounted "/compat/ubuntu/home" && (mount -t nullfs /home "/compat/ubuntu/home" || exit 1)
  unmounted "/compat/ubuntu/proc" && (mount -o nocover -t linprocfs linprocfs "/compat/ubuntu/proc" || exit 1)
  unmounted "/compat/ubuntu/sys" && (mount -o nocover -t linsysfs linsysfs "/compat/ubuntu/sys" || exit 1)
  unmounted "/compat/ubuntu/tmp" && (mount -t nullfs /tmp "/compat/ubuntu/tmp" || exit 1)

  # Mount devfs, fdescfs, and procfs on the host
  unmounted /dev/fd && (mount -o nocover -t fdescfs fdescfs /dev/fd || exit 1)
  unmounted /proc && (mount -o nocover -t procfs procfs /proc || exit 1)
  true
}

load_rc_config $name
run_rc_command "$1"
```


### Optional: ZFS dataset

If you want the benefits of ZFS (snapshots, integrity checks, deduplication, etc), now's a good time to create a ZFS dataset for the Ubuntu directory:

```sh
$ zfs create -o compression=on -o mountpoint=/compat zroot/compat
```


You could also use BTRFS - although it's much less battle-tested, it's what I use on my main Arch install, and I chose to use it here as well rather than ZFS.


For either option, snapshotting should be used as a quick backup before making any potentially-breaking changes:

```sh
$ zfs snapshot -r zroot/compat@2024-01-01
```


### Directory creation

Before diving into installing Ubuntu, we need to ensure the necessary directories are in place:

```sh
$ mkdir -p /compat/ubuntu/{dev/fd,dev/shm,home,proc,sys,tmp}
```


### Starting the service

Now we enable (and start) the service with `sysrc`:

```sh
$ sysrc ubuntu_enable=YES
$ service ubuntu start
compat.linux-emul_path: /compat/linux -> /compat/ubuntu
```


## Bootstrapping Ubuntu Base

Using Debootstrap[^2], we'll download and install the Ubuntu base systems by specifying the target's name, e.g., focal for 'Focal Fossa' (version 20.04 LTS).

```sh
$ pkg install debootstrap
$ debootstrap --arch=amd64 --no-check-gpg focal /compat/ubuntu
```

The output should look similar to the following:

```sh
I: Retrieving InRelease
I: Checking Release signature
I: Valid Release signature (key id F6ECB3762474EDA9D21B7022871920D1991BC93C)
I: Retrieving Packages
I: Validating Packages
I: Resolving dependencies of required packages...
I: Resolving dependencies of base packages...
I: Checking component main on http://archive.ubuntu.com/ubuntu...
[...]
I: Configuring console-setup...
I: Configuring kbd...
I: Configuring ubuntu-minimal...
I: Configuring libc-bin...
I: Configuring ca-certificates...
I: Base system installed successfully.
```

Post-installation, we need to restart the service:

```sh
$ service ubuntu restart
compat.linux.emul_path: /compat/ubuntu -> /compat/ubuntu
```

And replace the following shared lib with a new symbolic link:

```sh
$ cd /compat/ubuntu/lib64/
$ rm ./ld-linux-x86-64.so.2 && \
  ln -s ../lib/x86_64-linux-gnu/ld-2.31.so ld-linux-x86-64.so.2
```


### Configuration

There are a few small configuration tweaks we need to make. First, chroot into the Jail, which will confine the following commands to it:

```sh
$ chroot /compat/ubuntu /bin/bash
```

Next, we can adjust the timezone to match our host system:

```sh
/$ printf "%b\n" "0.0 0 0.0\n0\nUTC" > /etc/adjtime
/$ dpkg-reconfigure tzdata
```

Fix the `apt` package manager:

```sh
/$ printf "APT::Cache-Start 251658240;" > /etc/apt/apt.conf.d/00aptitude
```

And add some initial repositories to `sources.list`:

```sh
/$ printf "deb http://archive.ubuntu.com/ubuntu/ focal main restricted universe multiverse" > /etc/apt/sources.list
```

To exit the jail, use `exit`.


And voilà! FreeBSD is good-to-go now with our Ubuntu compatibility-layer jail, with its Ubuntu base system installed.


### Updating / Installing packages

First, make sure you're `chroot`-ed into the Jail. `apt` can then be run as it would on a normal Ubuntu system:

```sh
$ chroot /compat/ubuntu /bin/bash
/$ apt update && apt upgrade
/$ apt autoremove
/$ apt clean
```

### Uninstalling

If wanted, the Ubuntu Jail and these compatibility tools can be safely removed, mostly by following the reverse order. First, the automatic startup we set needs to be disabled. FreeBSD then needs to be rebooted, before finally deleting the Ubuntu system directory and/or destroying its volume.


## Wrapping up

With those updating/future removal tips in mind, we're almost done! The final step is to use Ubuntu's apt package manager as you would in a normal Ubuntu system to install Spotify. You may want to create a script or symlink for easier access without needing to navigate the command-line and chroot into the jail each time. That aside, most programs/binaries should work out-of-the-box. If some libraries are still missing, though, there's a section in FreeBSD's docs on [installing additional libs manually](https://docs.freebsd.org/en/books/handbook/linuxemu/#linuxemu-libs-manually).

<Image
  src="/assets/img/ADAC2ADE-B080-4A87-938A-9FEB9714CC64.png"
  alt="Screenshot of Spotify's desktop client running under FreeBSD"
/>


Great success! 🥳


I hope this writeup helped out! A massive thanks to Micski and their amazing writeup on this same topic back in 2021 - their steps & scripts are what I based this guide on, and helped me get up-and-running with Spotify, Slack, Zoom, and other essentials, allowing me to daily-drive FreeBSD on my development machine.


[^1]: More on Jails: https://wiki.freebsd.org/Jails

[^2]: More on FreeBSD's Debootstrap: https://docs.freebsd.org/en/books/handbook/linuxemu/#linuxemu-debootstrap
