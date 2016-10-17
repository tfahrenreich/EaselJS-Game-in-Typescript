/**
 * Created by timfahrenreich on 10/17/16.
 */
export default class KeyMappings {
    static KEYCODE_ENTER = 13;		//useful keycode
    static KEYCODE_SPACE = 32;		//useful keycode
    static KEYCODE_UP = 38;		//useful keycode
    static KEYCODE_LEFT = 37;		//useful keycode
    static KEYCODE_RIGHT = 39;		//useful keycode
    static KEYCODE_W = 87;			//useful keycode
    static KEYCODE_A = 65;			//useful keycode
    static KEYCODE_D = 68;			//useful keycode

    public shootHeld: boolean;			//is the user holding a shoot command
    public lfHeld: boolean;				//is the user holding a turn left command
    public rtHeld: boolean;				//is the user holding a turn right command
    public fwdHeld: boolean;			//is the user holding a forward command

    constructor() {

    }

    public handleKeyDown(e) {
        switch (e.keyCode) {
            case KeyMappings.KEYCODE_SPACE:
                this.shootHeld = true;
                return false;
            case KeyMappings.KEYCODE_A:
            case KeyMappings.KEYCODE_LEFT:
                this.lfHeld = true;
                return false;
            case KeyMappings.KEYCODE_D:
            case KeyMappings.KEYCODE_RIGHT:
                this.rtHeld = true;
                return false;
            case KeyMappings.KEYCODE_W:
            case KeyMappings.KEYCODE_UP:
                this.fwdHeld = true;
                return false;
        }
    }

    public handleKeyUp(e) {
        switch (e.keyCode) {
            case KeyMappings.KEYCODE_SPACE:
                this.shootHeld = false;
                break;
            case KeyMappings.KEYCODE_A:
            case KeyMappings.KEYCODE_LEFT:
                this.lfHeld = false;
                break;
            case KeyMappings.KEYCODE_D:
            case KeyMappings.KEYCODE_RIGHT:
                this.rtHeld = false;
                break;
            case KeyMappings.KEYCODE_W:
            case KeyMappings.KEYCODE_UP:
                this.fwdHeld = false;
                break;
        }
    }
}