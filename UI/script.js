  class EyeController {
    constructor(elements = {}, eyeSize = '33.33vmin') {
        this._eyeSize = eyeSize;
        this._blinkTimeoutID = null;
        this.setElements(elements);
      }
    
      get leftEye() { return this._leftEye; }
      get rightEye() { return this._rightEye; }
    
      setElements({
        leftEye, rightEye, upperLeftEyelid, upperRightEyelid, lowerLeftEyelid, lowerRightEyelid,
      } = {}) {
        this._leftEye = leftEye;
        this._rightEye = rightEye;
        this._upperLeftEyelid = upperLeftEyelid;
        this._upperRightEyelid = upperRightEyelid;
        this._lowerLeftEyelid = lowerLeftEyelid;
        this._lowerRightEyelid = lowerRightEyelid;
        return this;
      }
    
      _createKeyframes({ tgtTranYVal = 0, tgtRotVal = 0, enteredOffset = 1/3, exitingOffset = 2/3 } = {}) {
        return [
          { transform: 'translateY(0px) rotate(0deg)', offset: 0.0 },
          { transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`, offset: enteredOffset },
          { transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`, offset: exitingOffset },
          { transform: 'translateY(0px) rotate(0deg)', offset: 1.0 },
        ];
      }
    
      express({ type = '', duration = 1000, enterDuration = 75, exitDuration = 75 }) {
        if (!this._leftEye) {
          console.warn('Eye elements are not set; return;');
          return;
        }
    
        const options = { duration };
    
        switch (type) {
          case 'happy':
            return {
              lowerLeftEyelid: this._lowerLeftEyelid.animate(this._createKeyframes({
                tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
                tgtRotVal: '30deg',
                enteredOffset: enterDuration / duration,
                exitingOffset: 1 - (exitDuration / duration),
              }), options),
              lowerRightEyelid: this._lowerRightEyelid.animate(this._createKeyframes({
                tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
                tgtRotVal: '-30deg',
                enteredOffset: enterDuration / duration,
                exitingOffset: 1 - (exitDuration / duration),
              }), options),
            };
            case 'sad':
              return {
                upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
                  tgtRotVal: `-20deg`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
                upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
                  tgtRotVal: `20deg`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
              };
      
            case 'angry':
              return {
                upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
                  tgtRotVal: `30deg`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
                upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
                  tgtRotVal: `-30deg`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
              };
      
            case 'focused':
              return {
                upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
                upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
                lowerLeftEyelid: this._lowerLeftEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
                lowerRightEyelid: this._lowerRightEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
              }
      
            case 'confused':
              return {
                upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
                  tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
                  tgtRotVal: `-10deg`,
                  enteredOffset: enterDuration / duration,
                  exitingOffset: 1 - (exitDuration / duration),
                }), options),
              }
      
            default:
              console.warn(`Invalid input type=${type}`);
          }
        }
        
      blink({ duration = 150 } = {}) {
        if (!this._leftEye) {
          console.warn('Eye elements are not set; return;');
          return;
        }
    
        [this._leftEye, this._rightEye].forEach((eye) => {
          eye.animate([
            { transform: 'rotateX(0deg)' },
            { transform: 'rotateX(90deg)' },
            { transform: 'rotateX(0deg)' },
          ], { duration, iterations: 1 });
        });
      }
    
      startBlinking({ delay = 0, maxInterval = 5000 } = {}) {
        if (this._blinkTimeoutID) {
          console.warn(`Already blinking with timeoutID=${this._blinkTimeoutID}; return;`);
          return;
        }
    
        this._blinkTimeoutID = setTimeout(() => {
          this.blink();
          this.startBlinking({ maxInterval }); 
        }, delay);
    
        const blinkRandomly = () => {
          this._blinkTimeoutID = setTimeout(() => {
            this.blink();
            blinkRandomly(); 
          }, Math.random() * maxInterval);
        };
    
        blinkRandomly();
      }
    
      setEyePosition(eyeElem, x, y, isRight = false) {
        if (!eyeElem) {
          console.warn('Invalid inputs ', eyeElem, x, y, '; retuning');
          return;
        }
    
        if (x) {
          eyeElem.style[isRight ? 'right' : 'left'] = `calc(${this._eyeSize} / 3 * 2 * ${isRight ? 1 - x : x})`;
        }
    
        if (y) {
          eyeElem.style.bottom = `calc(${this._eyeSize} / 3 * 2 * ${1 - y})`;
        }
      }
      
    }
    
    const eyes = new EyeController({
      leftEye: document.querySelector('.left.eye'),
      rightEye: document.querySelector('.right.eye'),
      upperLeftEyelid: document.querySelector('.left .eyelid.upper'),
      upperRightEyelid: document.querySelector('.right .eyelid.upper'),
      lowerLeftEyelid: document.querySelector('.left .eyelid.lower'),
      lowerRightEyelid: document.querySelector('.right .eyelid.lower'),

    });
    eyes.startBlinking({ delay: 3000 });




