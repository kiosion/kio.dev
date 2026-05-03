---
layout: post
title: DSLR Cameras as Webcams on Linux
date: 2022-04-13
tags: [guides]
desc: Using DSLR or Mirrorless cameras as 'webcams' on Linux thanks to v4l2
---

After a few months of remote work I got fed up with my computer's terrible webcam. Without the perfect lighting everything's a blurry mess, and it constantly failed to actually be detected by Zoom correctly. If you're similarly frustrated, and happen to have a DSLR or Mirrorless camera laying around that supports USB previews, and use Arch Linux, and have a bit of patience to poke around in the command-line, then wow, this is the perfect guide for you! :)

I'll quickly detail here how I got my Canon 200D working as a "webcam" on my Arch Linux setup. After the initial tinkering, it's been a pretty flawless experience, and besides a few short mentions, I couldn't find any comprehensive walkthrough of these steps online.

## Setup

Make sure you've got a relatively recent kernel installed - I've tested this setup with major versions above 5.15.x and they all seem to work fine.

First up, install the `linux-headers` package using pacman or your favourite AUR helper, if you don't already have it. These are needed in order to build kernel modules; we'll need them for v4l2. Note that if you're using a custom kernel, such as Xanmod or Zen, you'll need to install the headers for it instead (e.g. `linux-xanmod-headers`).

After the headers are installed, install the `v4l2loopback-dkms` package from the AUR. Then, ensure it's loaded using `modprobe` - A good idea is to also add an entry to `/etc/modules-load.d` so it's always loaded automatically at boot.

Next, we can list all video devices using `v4l2-ctl` — You should see something like `'Dummy video device (0x0000)'`, and a `/dev/` path:

```bash
$ v4l2-ctl --list-devices

Dummy video device (0x0000) (platform:v4l2loopback-000):
    /dev/video0
```

Yay! That means the module's loaded properly. Next up, we need to install `gphoto2` in order to snag the camera's preview output and pipe it to that `/dev/video0/` path, using `ffmpeg`.

After installing the `gphoto2` package from the AUR, connect your camera via USB, and check the output of `gphoto2 --auto-detect`. It should look something like this:

```bash
$ gphoto2 --auto-detect

Model                          Port
----------------------------------------------------------
Canon EOS 200D                 usb:009,013
```

## Usage

The final step is to put together a one-liner script to take `gphoto2`'s preview and pipe that to the dummy video device `v4l2` has created for us - make sure to check the exact `/dev/` path from earlier, yours may not be `video0`. Something like this:

```bash
$ gphoto2 --stdout --capture-movie | ffmpeg -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
```

Since `ffmpeg` is handling the stream's encoding, we can take advantage of any of its CLI options, e.g., limiting the frame rate to lower CPU usage, or applying filters to the video.

So, what's a good way to permanently use this setup? I personally don't mind a bit of jank in my setup, so I currently just have a script living in `/usr/bin` that runs the initial command to start piping the video output to `/dev/video0`, and to attempt to restart on any failures. This script is then added to my `bspwmrc`'s autostart section to run on every interactive login, although you could also run it manually in a new shell only when you want to use your webcam.

That's all there is to it, though! Feel free to reach out if you have any issues getting this working, I've spent a while before troubleshooting so may have an idea of where to start.
