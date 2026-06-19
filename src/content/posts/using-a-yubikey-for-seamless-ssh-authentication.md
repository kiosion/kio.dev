---
layout: post
title: Using a Yubikey for SSH Authentication on MacOS / Linux
date: 2021-11-29
tags: [security, ssh, guides]
desc: How to authenticate SSH connections using your Yubikey's Authentication slot, on both Linux and MacOS.
---

Setting up a Yubikey for SSH authentication can be a bit tricky, and I found
that a lot of the existing guides out there were lacking, so I decided to write
up my own to make things easier for others attempting this.

From my research, most guides focus on using the Smart Card slot for GPG. But
honestly, that's overkill and can be a bit of a hassle. Luckily, with
[`yubikey-agent`](https://github.com/FiloSottile/yubikey-agent), we can use the
Authentication slot (9a) and keep the Smart Card slot open for other uses.

## Setup

### Linux

yubikey-manager can be used as either an AppImage from
[Yubikey's website](https://www.yubico.com/support/download/yubikey-manager/)
or installed from your package manager.

- On Arch Linux, it's available under the name
  [`yubikey-manager-qt`](https://archlinux.org/packages/community/x86_64/yubikey-manager-qt/);
  [`yubikey-manager`](https://archlinux.org/packages/community/x86_64/yubikey-manager/)
  for the CLI version.
- On Ubuntu, it's also available under the name
  [`yubikey-manager-qt`](https://packages.ubuntu.com/search?suite=default&section=all&arch=any&keywords=yubikey-manager-qt&searchon=names);
  [`yubikey-manager`](https://packages.ubuntu.com/search?suite=default&section=all&arch=any&keywords=yubikey-manager&searchon=names)
  for the CLI version.

After installation, `pcscd.service` needs to be enabled and started:
`sudo systemctl enable pcscd.service --now`.

yubikey-manager can be found under the name `ykman-gui`; `ykman` for the CLI
version.

yubikey-agent can be installed using the `yubikey-agent` package from the AUR,
or on other distros, can be installed manually.

After installation, it needs to be enabled and started:
`systemctl daemon-reload --user && systemctl --user enable yubikey-agent.service --now`.

### MacOS

yubikey-manager can be downloaded and installed from
[Yubikey's website](https://www.yubico.com/support/download/yubikey-manager/).

yubikey-agent can be installed using Homebrew: `brew install yubikey-agent`.
After installation, it needs to be enabled using `brew services start yubikey-agent`.

## Steps

### Generate a new key

Here, you could either choose `yubikey-agent -setup`, or, use yubikey-manager
to generate a key. I chose the second option and recommend it, as although
yubikey-agent is easier, it doesn't give any control over the type or length
of key generated.

#### Using yubikey-agent

To generate a new key with yubikey-agent and store it in your Yubikey's PIV
authentication slot, simply run `yubikey-agent -setup` with your yubikey
connected and follow the steps.

You'll be asked to set a PIN, and be given your public key once the process is
finished.

> It's important to note that `yubikey-agent -setup` generates a random
> Management Key and stores it in PIN-protected metadata, making it difficult
> to use other PIV slots without some hack-y workarounds[^1].

#### Using yubikey-manager

To generate a new key using the yubikey-manager software, navigate to the
'Applications > PIV' tab, and make sure the 'Authentication' slot is selected.
If there's already a certificate present, make sure it's not important and not
in use. Overwriting the slot is not reversible.

Click 'Generate', select the key type you want to generate (the default should
be fine if you're not sure), name it 'SSH Key', and set the expiration date.

If everything looks good, save it and enter the PIN to confirm. If you haven't
set one previously, the default is 123456. This should be changed to something
more secure, along with the PUK and Management Key. Save these somewhere
offline and safe.

### Configure your shell

Next, you'll need to configure your shell to set the `SSH_AUTH_SOCK`
environment variable on launch.

First find the location of the yubikey-agent socket. You can look at the output
of `ps aux | grep yubikey-agent` if you're not sure. For me, on Linux, its
location was `/run/user/{UID}/yubikey-agent/yubikey-agent.sock` by default.

#### Fish

Open your config and add
`set -gx SSH_AUTH_SOCK "/run/user/{UID}/yubikey-agent/yubikey-agent.sock"`,
where the path is the location of the yubikey-agent socket.

#### Bash/ZSH

Open your config and add
`export SSH_AUTH_SOCK="/run/user/{UID}/yubikey-agent/yubikey-agent.sock"`,
where the path is the location of the yubikey-agent socket.

### Extra deps

Finally, in order to actually use the private key, you first need to
authenticate with your set PIN. If you're running a distro such as Ubuntu this
should work out-of-the-box, but if you're on a custom or more minimal install,
you may need to install a compatible keychain and polkit agent first. I prefer
GNOME's polkit agent since it displays nice-looking modals and works with
archlinux-keychain, but any should work.

## More

That's it! You should now have a fully configured and working SSH key in your
Yubikey's Authentication slot.

- To print the public key and test the setup, run `ssh-add -L`.
  - If you don't see any identities, or get an error, double-check all the
    required services are installed and running, and that you've configured your
    shell's SSH_AUTH_SOCK environment variable correctly.
- If not using the '-setup' flag with yubikey-agent, _make sure_ you set a
  secure PIN, PUK, and Management Key and store them somewhere safe and offline.
- If you run into issues using the Yubikey for other functionality after using
  it with yubikey-agent, I've found either unplugging-and-re-plugging it, or
  sending a SIGHUP to the yubikey-agent process solves this.

[^1]: See yubikey-agent's [manual setup instructions](https://github.com/FiloSottile/yubikey-agent#manual-setup-and-technical-details)
