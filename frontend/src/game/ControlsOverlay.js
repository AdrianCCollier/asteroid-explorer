const TUTORIAL_STEPS = [
  { id: 'moveLeft',  instruction: 'Move Left',    hint: 'Press A',                  detect: 'keydown-A'     },
  { id: 'moveRight', instruction: 'Move Right',   hint: 'Press D',                  detect: 'keydown-D'     },
  { id: 'jump',      instruction: 'Jump',         hint: 'Press SPACE',              detect: 'keydown-SPACE' },
  { id: 'boostJump', instruction: 'Boost Jump',   hint: 'Press SPACE twice quickly', detect: 'double-space' },
  { id: 'aim',       instruction: 'Aim',          hint: 'Move your mouse',          detect: 'pointermove'   },
  { id: 'shoot',     instruction: 'Shoot',        hint: 'Left Mouse Click',         detect: 'pointerdown'   },
]

export default class ControlsOverlay {
  constructor(scene) {
    this.scene = scene
    this.stepIndex = 0
    this.active = false
    this._lastSpaceTime = 0
    this._currentListenerTarget = null
    this._currentListenerType = null
    this._currentFn = null
    this._blinkTween = null

    this._buildPanel()
    this._fadeIn()
    this._showStep(0)
  }

  _buildPanel() {
    const cx = this.scene.cameras.main.width / 2
    const cy = this.scene.cameras.main.height / 2

    this.panel = this.scene.add
      .rectangle(cx, cy, 400, 210, 0x000000, 0.82)
      .setScrollFactor(0)
      .setDepth(1001)
      .setAlpha(0)

    this.progressText = this.scene.add
      .text(cx, cy - 85, '', { font: '14px Arial', fill: '#aaaaaa' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002)
      .setAlpha(0)

    this.instructionText = this.scene.add
      .text(cx, cy - 20, '', { font: 'bold 28px Arial', fill: '#FFFFFF' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002)
      .setAlpha(0)

    this.hintText = this.scene.add
      .text(cx, cy + 30, '', { font: '20px Arial', fill: '#cccccc' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002)
      .setAlpha(0)

    this.blinkDot = this.scene.add
      .text(cx, cy + 75, '●', { font: '16px Arial', fill: '#888888' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002)
      .setAlpha(0)

    this.skipButton = this.scene.add
      .text(cx + 175, cy - 88, '✕', { font: '18px Arial', fill: '#aaaaaa' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.skipButton.setStyle({ fill: '#ff4444' }))
      .on('pointerout', () => this.skipButton.setStyle({ fill: '#aaaaaa' }))
      .on('pointerdown', () => this._dismiss())

    this._blinkTween = this.scene.tweens.add({
      targets: this.blinkDot,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  _fadeIn() {
    const targets = [
      this.panel, this.progressText, this.instructionText,
      this.hintText, this.blinkDot, this.skipButton,
    ]
    this.scene.tweens.add({
      targets,
      alpha: 1,
      duration: 300,
      ease: 'Quad.easeOut',
    })
  }

  _showStep(index) {
    if (index >= TUTORIAL_STEPS.length) {
      this._showCompletion()
      return
    }

    this.stepIndex = index
    this.active = true
    const step = TUTORIAL_STEPS[index]

    this.progressText.setText(`Step ${index + 1} / ${TUTORIAL_STEPS.length}`)
    this.instructionText.setText(step.instruction)
    this.hintText.setText(step.hint)
    this.blinkDot.setAlpha(1)

    this._registerDetector(step)
  }

  _registerDetector(step) {
    this._removeCurrentListener()

    if (step.detect === 'double-space') {
      this._currentFn = () => {
        const now = Date.now()
        if (now - this._lastSpaceTime < 400) {
          this._advance()
        }
        this._lastSpaceTime = now
      }
      this._currentListenerTarget = this.scene.input.keyboard
      this._currentListenerType = 'keydown-SPACE'
      this.scene.input.keyboard.on('keydown-SPACE', this._currentFn)

    } else if (step.detect === 'pointermove') {
      this._currentFn = () => this._advance()
      this._currentListenerTarget = this.scene.input
      this._currentListenerType = 'pointermove'
      this.scene.input.on('pointermove', this._currentFn)

    } else if (step.detect === 'pointerdown') {
      this._currentFn = (pointer) => {
        if (pointer.leftButtonDown()) this._advance()
      }
      this._currentListenerTarget = this.scene.input
      this._currentListenerType = 'pointerdown'
      this.scene.input.on('pointerdown', this._currentFn)

    } else {
      this._currentFn = () => this._advance()
      this._currentListenerTarget = this.scene.input.keyboard
      this._currentListenerType = step.detect
      this.scene.input.keyboard.on(step.detect, this._currentFn)
    }
  }

  _advance() {
    if (!this.active) return
    this.active = false
    this._removeCurrentListener()
    this._flashSuccess(() => this._showStep(this.stepIndex + 1))
  }

  _flashSuccess(onComplete) {
    if (this._blinkTween) this._blinkTween.pause()
    this.panel.setFillStyle(0x00aa44, 0.9)
    this.scene.time.delayedCall(300, () => {
      if (!this.panel) return
      this.panel.setFillStyle(0x000000, 0.82)
      if (this._blinkTween) this._blinkTween.resume()
      if (onComplete) onComplete()
    }, [], this)
  }

  _showCompletion() {
    this._removeCurrentListener()
    if (this._blinkTween) {
      this._blinkTween.stop()
      this._blinkTween = null
    }
    this.blinkDot.setVisible(false)
    this.skipButton.setVisible(false)

    this.progressText.setText('')
    this.instructionText.setText("You're ready to explore!")
    this.hintText.setText('')
    this.panel.setFillStyle(0x006622, 0.9)

    this.scene.time.delayedCall(2000, () => this._dismiss(), [], this)
  }

  _dismiss() {
    if (!this.panel) return

    this.active = false
    this._removeCurrentListener()

    if (this._blinkTween) {
      this._blinkTween.stop()
      this._blinkTween = null
    }

    const targets = [
      this.panel, this.progressText, this.instructionText,
      this.hintText, this.blinkDot, this.skipButton,
    ]

    this.scene.tweens.add({
      targets,
      alpha: 0,
      duration: 300,
      ease: 'Quad.easeIn',
      onComplete: () => {
        targets.forEach(obj => { if (obj && obj.destroy) obj.destroy() })
        this.panel = null
      },
    })
  }

  _removeCurrentListener() {
    if (this._currentListenerTarget && this._currentFn) {
      this._currentListenerTarget.off(this._currentListenerType, this._currentFn)
      this._currentListenerTarget = null
      this._currentListenerType = null
      this._currentFn = null
    }
  }
}
