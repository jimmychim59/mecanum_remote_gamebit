// 降低靈敏度
function dead_zone () {
    if (x < joystick_deadzone && x > joystick_deadzone * -1) {
        x = 0
    }
    if (y < joystick_deadzone && y > joystick_deadzone * -1) {
        y = 0
    }
}
function CarOmni () {
    w1 = x + y
    w2 = x - y
    radio.sendValue("w2", w2)
    radio.sendValue("w1", w1)
}
input.onButtonPressed(Button.A, function () {
    radio.sendValue("f1", 0)
})
function Joystick () {
    x = Math.map(pins.analogReadPin(AnalogPin.P1), 0, 1023, -255, 255)
    y = Math.map(pins.analogReadPin(AnalogPin.P2), 0, 1023, 255, -255)
    dead_zone()
    myDot.set(LedSpriteProperty.X, Math.map(x, -255, 255, 0, Display))
    myDot.set(LedSpriteProperty.Y, Math.map(y, -255, 255, 0, Display))
}
input.onButtonPressed(Button.B, function () {
    radio.sendValue("STOP", 0)
    sflag = -1 * sflag
})
function CarMove () {
    Joystick()
    if (moveFlag == 1) {
        CarOmni()
    } else if (moveFlag == 2) {
        CarTurn()
    } else if (moveFlag == 3) {
        CarDrift()
    }
}
function CarTurn () {
    if (x > 0) {
        if (y != 0) {
            radio.sendValue("rw1", 0)
            radio.sendValue("rw2", y)
        } else {
            radio.sendValue("rw1", -1 * x)
            radio.sendValue("rw2", -1 * x)
        }
    } else if (x < 0) {
        if (y != 0) {
            radio.sendValue("rw1", -1 * y)
            radio.sendValue("rw2", 0)
        } else {
            radio.sendValue("rw1", -1 * x)
            radio.sendValue("rw2", -1 * x)
        }
    } else {
        radio.sendValue("rw1", -1 * y)
        radio.sendValue("rw2", y)
    }
}
function CarDrift () {
    radio.sendValue("a1", x)
    if (y > 0) {
        if (x > 0) {
            radio.sendValue("a2", Math.map(y, -255, 255, 0, -150))
        } else {
            radio.sendValue("a2", Math.map(y, -255, 255, 0, 150))
        }
    } else {
        radio.sendValue("a2", 0)
    }
}
let sflag = 0
let w2 = 0
let w1 = 0
let y = 0
let x = 0
let moveFlag = 0
let joystick_deadzone = 0
let Display = 0
let myDot: game.LedSprite = null
led.setBrightness(255)
basic.showIcon(IconNames.Happy)
let radio_gp = 39
radio.setGroup(radio_gp)
myDot = game.createSprite(3, 3)
pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
Display = 5
joystick_deadzone = 140
music.setBuiltInSpeakerEnabled(true)
moveFlag = -1
music.setVolume(80)
music.stopMelody(MelodyStopOptions.All)
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P15) == 0) {
        moveFlag = -1
        led.setBrightness(50)
        basic.showIcon(IconNames.No)
        radio.sendValue("stop", -1)
        music.playSoundEffect(music.builtinSoundEffect(soundExpression.sad), SoundExpressionPlayMode.UntilDone)
        basic.pause(100)
    } else if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        moveFlag = 1
        led.setBrightness(255)
        basic.showIcon(IconNames.Happy)
        radio.sendValue("mode", moveFlag)
        music.playTone(523, music.beat(BeatFraction.Half))
        basic.pause(100)
    } else if (pins.digitalReadPin(DigitalPin.P14) == 0) {
        moveFlag = 2
        led.setBrightness(255)
        basic.showLeds(`
            . . . . .
            . # . # .
            # # . # #
            . # . # .
            . . . . .
            `)
        radio.sendValue("mode", moveFlag)
        music.playTone(262, music.beat(BeatFraction.Quarter))
        basic.pause(100)
    } else if (pins.digitalReadPin(DigitalPin.P16) == 0) {
        moveFlag = 3
        led.setBrightness(255)
        basic.showLeds(`
            # # . # #
            # . . . #
            . . . . .
            . . # . .
            . # # # .
            `)
        radio.sendValue("mode", moveFlag)
        music.playTone(131, music.beat(BeatFraction.Quarter))
        basic.pause(100)
    } else {
        CarMove()
    }
})
