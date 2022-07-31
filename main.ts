// 降低靈敏度
function dead_zone () {
    if (x < 140 && x > -140) {
        x = 0
    }
    if (y < 140 && y > -140) {
        y = 0
    }
}
function CarOmni () {
	
}
function Joystick () {
    x = Math.map(pins.analogReadPin(AnalogPin.P1), 0, 1023, -255, 255)
    y = Math.map(pins.analogReadPin(AnalogPin.P2), 0, 1023, -255, 255)
    dead_zone()
}
input.onButtonPressed(Button.B, function () {
    radio.sendValue("STOP", 0)
    sflag = -1 * sflag
})
function CarMove () {
    Joystick()
    if (moveFlag == 2) {
        CarTurn()
    } else if (moveFlag == 3) {
        CarDrift()
    } else {
        CarOmni()
    }
}
function CarTurn () {
	
}
function CarDrift () {
	
}
let y = 0
let x = 0
let moveFlag = 0
let sflag = 0
led.setBrightness(255)
basic.showIcon(IconNames.Happy)
radio.setGroup(39)
let myDot = game.createSprite(3, 3)
pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
music.setBuiltInSpeakerEnabled(true)
let Maxspeed = 10
let Display = 4
sflag = -1
moveFlag = -1
music.setVolume(80)
music.stopMelody(MelodyStopOptions.All)
basic.forever(function () {
    // p15 Red Button = Stop (moveFlag = -1)
    // 
    // p13 Green Button = Go (moveFlag = 1)
    // p14 Yellow Button = Turn (moveFlag = 2)
    // p16 Blue Button = Drift (moveFlag = 3)
    if (pins.digitalReadPin(DigitalPin.P15) == 0) {
        moveFlag = -1
        basic.showIcon(IconNames.No)
        music.playSoundEffect(music.createSoundEffect(WaveShape.Sine, 500, 500, 255, 0, 50, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), SoundExpressionPlayMode.InBackground)
    } else if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        moveFlag = 1
        basic.showIcon(IconNames.Happy)
        music.playSoundEffect(music.createSoundEffect(WaveShape.Noise, 500, 499, 255, 0, 750, SoundExpressionEffect.None, InterpolationCurve.Linear), SoundExpressionPlayMode.InBackground)
    } else if (pins.digitalReadPin(DigitalPin.P14) == 0) {
        moveFlag = 2
        basic.showLeds(`
            . . . . .
            . # . # .
            # # . # #
            . # . # .
            . . . . .
            `)
        music.playSoundEffect(music.createSoundEffect(WaveShape.Sine, 400, 600, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), SoundExpressionPlayMode.InBackground)
    } else if (pins.digitalReadPin(DigitalPin.P16) == 0) {
        moveFlag = 3
        basic.showLeds(`
            # # . # #
            # . . . #
            . . . . .
            . . # . .
            . # # # .
            `)
        music.playSoundEffect(music.createSoundEffect(WaveShape.Sine, 1600, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), SoundExpressionPlayMode.InBackground)
    } else if (moveFlag > 0) {
        CarMove()
    }
})
