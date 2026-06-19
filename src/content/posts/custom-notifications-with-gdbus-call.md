---
layout: post
title: Custom Notifications with 'gdbus call' + 'wired-notify'
date: 2022-06-09
tags: [guides, linux]
---

<script>
  import Image from '$components/images/image.svelte';
</script>

I wanted to write this short guide on the functionality of `gdbus call` as I
couldn't find any resources online regarding it besides its own documentation.
I'll also quickly cover my wired-notify config, since it's a really neat
notification daemon that I don't think is nearly popular enough :)

Here's the reason I went through this trouble, first off: a tiny configurable
volume HUD that live-updates in place as you change the device volume.

<Image
  src="/assets/img/8A566FF9-492B-4CB3-945B-2370F47CC856.png"
  alt="Screenshot of custom scripted volume HUD over desktop"
/>

Although `gdbus call` has _many_ use-cases, the one I'll focus on here is
sending custom notifications, as notify-send doesn't expose many of the
properties I needed to set. `notify-send`, along with other notification
frameworks I looked at, didn't support updating existing notifications using
identifiers. `gdbus call` does allow this granular control, along with exposing
some other cool properties.

## Syntax

```sh
gdbus call \
  --session \
  --dest org.freedesktop.Notifications \
  --object-path /org/freedesktop/Notifications \
  --method org.freedesktop.Notifications.Notify \
  -- \
  "identifier" \
  "1" \
  "" \
  "Notification title" \
  "Notification description" \
  "[]" \
  "{}" \
  "4000"
```

Running this will return `(uint32 1,)`, the '1' representing the notification's
unique identifier. This is useful if you want to parse that identifier and
re-use it later; one way to do so would be using sed (e.g.,
`sed 's/[^ ]* //; s/,.//'` would strip everything but the identifier).

A few other tips:

- `--session` represents the user's `systemd --user` instance
- `--dest`, `--object-path`, and `--method` in this case are all used to point
  to `freedesktop.notifications.notify`, and the following parameters are
  specified in freedesktop's documentation
- The '1' represents the identifier, and the replaces ID
- The following blank string is the notification icon
- The following two strings are for the Summary (notification title) and Body
  (multi-line description)
- The empty array is for actions, for ex, sending a callback to the application
  when clicked
- The empty dictionary is for hints; these are used to send extra data such as
  (in my use case) the current volume level, an image, extra text, etc
- The '4000' represents the expiration timeout in ms. If set to -1, it falls
  back to the notification server's default

## Body text

The body text can, in most cases, contain limited markup:

- `<b>...</b>` for bold,
- `<i>...</i>` for italics,
- `<u>...</u>` for underlines,
- `<a href="...">...</a>` for links, and
- `<img src="..." alt="...">` for images

## Providing hints

Hints are provided as a dictionary, using the following format:

`{'Name': <'type':'value'>}`

So, for example, sending a hint for the integer value of my volume notification
looks like:

`{'value': <58>}`

And for providing a file path for an image preview:

`{'image-path': <'file:///dir/image.jpg'}`

Note that when providing the dictionary in the command, it should be encased by
double-quotes.

That's all there is to it! I hope this comes in handy for someone at some point
:)

## More configs

Finally, if you're curious, here's my wired-notify config, as well as the simple
script I call on volume update to send a notification to it:

```sh wired.ron
(
    max_notifications: 4,
    timeout: 10000,
    poll_interval: 16,
    history_length: 20,
    replacing_enabled: true,
    replacing_resets_timeout: true,
    min_window_width: 300,

    debug: false,
    debug_color: Color(r: 0.0, g: 1.0, b: 0.0, a: 1.0),
    debug_color_alt: Color(r: 1.0, g: 0.0, b: 0.0, a: 1.0),

    layout_blocks: [
        (
            name: "root",
            parent: "",
            hook: Hook(parent_anchor: TM, self_anchor: TM),
            offset: Vec2(x: 0.0, y: 40.0),
            render_anti_criteria: [Progress],
            params: NotificationBlock((
                monitor: 0,
                border_width: 0,
                border_rounding: 8,
                background_color: Color(hex: "#99000000"),
                border_color: Color(hex: "#99000000"),
                border_color_low: Color(hex: "#99000000"),
                border_color_critical: Color(hex: "#99000000"),
                border_color_paused: Color(hex: "#99000000"),
                gap: Vec2(x: 0.0, y: 12.0),
                notification_hook: Hook(parent_anchor: BL, self_anchor: TL),
            )),
        ),

        (
            name: "image",
            parent: "root",
            hook: Hook(parent_anchor: TL, self_anchor: TL),
            offset: Vec2(x: 0.0, y: 0.0),
            params: ImageBlock((
                image_type: Hint,
                padding: Padding(left: 6.0, right: 2.0, top: 6.0, bottom: 6.0),
                rounding: 6.0,
                scale_width: 64,
                scale_height: 64,
                filter_mode: Lanczos3,
            )),
        ),

        (
            name: "summary",
            parent: "image",
            hook: Hook(parent_anchor: MR, self_anchor: BL),
            offset: Vec2(x: 0.0, y: 0.0),
            params: TextBlock((
                text: "%s",
                font: "Arial Bold 11",
                ellipsize: End,
                color: Color(hex: "#F3F3F3"),
                color_hovered: Color(hex: "#DEDEDE"),
                padding: Padding(left: 8.0, right: 8.0, top: 6.0, bottom: 2.0),
                dimensions: (width: (min: 280, max: 280), height: (min: 0, max: 0)),
            )),
        ),

        (
            name: "body",
            parent: "summary",
            hook: Hook(parent_anchor: BL, self_anchor: TL),
            offset: Vec2(x: 0.0, y: -3.0),
            params: ScrollingTextBlock((
                text: "%b",
                font: "Arial 11",
                color: Color(hex: "#F3F3F3"),
                color_hovered: Color(hex: "#DEDEDE"),
                padding: Padding(left: 8.0, right: 8.0, top: 2.0, bottom: 6.0),
                width: (min: 150, max: 250),
                scroll_speed: 0.1,
                lhs_dist: 35.0,
                rhs_dist: 35.0,
                scroll_t: 1.0,
            )),
        ),

        (
            name: "rootProgress",
            parent: "",
            hook: Hook(parent_anchor: MM, self_anchor: MM),
            offset: Vec2(x: 0.0, y: 0.0),
            render_criteria: [Progress],
            params: NotificationBlock((
                monitor: 0,
                border_width: 0,
                border_rounding: 8,
                background_color: Color(hex: "#99000000"),
                border_color: Color(hex: "#99000000"),
                gap: Vec2(x: 0.0, y: 12.0),
                notification_hook: Hook(parent_anchor: BL, self_anchor: TL),
            )),
        ),
        (
            name: "progressBlock",
            parent: "rootProgress",
            hook: Hook(parent_anchor: TM, self_anchor: TM),
            offset: Vec2(x: 0.0, y: 0.0),
            params: ProgressBlock((
                padding: Padding(left: 12.0, right: 12.0, top: 12.0, bottom: 12.0),
                border_width: 0.0,
                border_rounding: 10.0,
                fill_rounding: 10.0,
                border_color: Color(hex: "#F3F3F3"),
                background_color: Color(hex: "#99000000"),
                fill_color: Color(hex: "#F3F3F3"),
                width: 276.0,
                height: 20.0,
                border_color_hovered: Color(hex: "#F3F3F3"),
                background_color_hovered: Color(hex: "#99000000"),
                fill_color_hovered: Color(hex: "#F3F3F3"),
            )),
        ),
        (
            name: "progressSummary",
            parent: "progressBlock",
            hook: Hook(parent_anchor: TM, self_anchor: BM),
            offset: Vec2(x: 0.0, y: 0.0),
            params: TextBlock((
                text: "%s",
                ellipsize: NoEllipsize,
                font: "Arial Bold 11",
                color: Color(hex: "#F3F3F3"),
                color_hovered: Color(hex: "#DEDEDE"),
                padding: Padding(left: 0.0, right: 0.0, top: 6.0, bottom: 12.0),
                dimensions: (width: (min: 0, max: 300), height: (min: 0, max: 0)),
            )),
        ),

        (
            name: "progressBody",
            parent: "progressBlock",
            hook: Hook(parent_anchor: BM, self_anchor: TM),
            offset: Vec2(x: 0.0, y: 0.0),
            params: TextBlock((
                text: "%b",
                font: "Arial 11",
                ellipsize: NoEllipsize,
                color: Color(hex: "#F3F3F3"),
                color_hovered: Color(hex: "#DEDEDE"),
                padding: Padding(left: 0.0, right: 0.0, top: 12.0, bottom: 6.0),
                dimensions: (width: (min: 0, max: 300), height: (min: 0, max: 0)),
            )),
        ),
    ],
)
```

```sh vol.sh
#!/usr/bin/env perl

## The sink should be the default
my $sink = `pactl get-default-sink`;

## Run pactl and store output
open(my $fh, '-|', 'pactl list sinks');

## Set the record separator to consecutive newlines (same as -000)
$/="\n\n";

while (<$fh>) {
    if (/Name:.$sink/) {
        ## Extract the current volume
        /Volume:.*?(\d+)%/;
        my $volume=$1;
        ## Send the notification, using gdbus so we can specify the
        ## ID to update on repeat
        exec "gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify 'identifier' '999' '' 'Volume' '$volume%' '[]' '{\"value\": <$volume>}' '4000'";
    }
}
```
