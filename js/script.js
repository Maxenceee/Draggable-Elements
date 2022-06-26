
function Ie(n) {
    return n.composedPath().some(e => e instanceof HTMLElement && e.hasAttribute("data-nodrag"))
}
const ne = class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.dragging = !1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.startOffsetX = 0;
        this.startOffsetY = 0;
        this.startClientX = 0;
        this.startClientY = 0;

        this.preventClickDuringDrag = e => {
            this.dragging && e.preventDefault()
        };
        this.mouseDown = e => {
            !Ie(e) && (e.preventDefault(), addEventListener("mousemove", this.mouseMove), addEventListener("mouseup", this.mouseUp), this.dragStart(e))
        };
        this.mouseMove = e => {
            e.preventDefault(),
            this.dragMove(e)
        };
        this.mouseUp = () => {
            removeEventListener("mousemove", this.mouseMove),
            removeEventListener("mouseup", this.mouseUp),
            this.dragEnd()
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.preventClickDuringDrag, {
            capture: !0
        }),
        this.addEventListener("mousedown", this.mouseDown)
    }
    dragStart({clientX: e, clientY: t})
    {
        document.documentElement.style.userSelect = "none",
        document.documentElement.style.webkitUserSelect = "none",
        this.style.touchAction = "none",
        this.startOffsetX = this.offsetX,
        this.startOffsetY = this.offsetY,
        this.startClientX = e,
        this.startClientY = t
    }
    dragMove({clientX: e, clientY: t})
    {
        Math.abs(e - this.startClientX) + Math.abs(t - this.startClientY) >= 4 && (this.dragging = !0),
        this.offsetX = this.startOffsetX + e - this.startClientX,
        this.offsetY = this.startOffsetY + t - this.startClientY,
        this.style.setProperty("--x", `${this.offsetX}px`),
        this.style.setProperty("--y", `${this.offsetY}px`)
    }
    dragEnd()
    {
        document.documentElement.style.removeProperty("user-select"),
        document.documentElement.style.removeProperty("-webkit-user-select"),
        this.style.removeProperty("touch-action"),
        requestAnimationFrame(() => {
            this.dragging = !1
        })
    }
}

customElements.define('draggable-element', ne);

const be = class extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('custom-reminder', be);


var vt = {
    default: {
        "panel-reminders": {
            left: 600,
            top: 50,
            width: 0,
            height: 0,
            windowWidth: 1680,
            windowHeight: 945,
            zIndex: 71
        },
    }
}
const transitionIn = function() {
    let e = window.innerWidth,
        t = window.innerHeight,
        s = Array.from(document.querySelectorAll("draggable-element")),
        o = s.map(i => i.getBoundingClientRect());
    for (let i = 0; i < s.length; i++) {
        let a = s[i],
            m = o[i],
            D = m.left + .5 * m.width - .5 * e,
            b = m.top + .5 * m.height - .5 * t;
        Math.abs(D) >= Math.abs(b) ? a.style.setProperty("--x", `${a.offsetX + Math.sign(D) * .5 * e}px`) : a.style.setProperty("--y", `${a.offsetY + Math.sign(b) * .5 * t}px`),
        requestAnimationFrame(() => {
            a.style.transformOrigin = "center center",
            a.style.transition = "transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            a.addEventListener("transitionend", () => {
                a.style.removeProperty("transform-origin"),
                a.style.removeProperty("transition")
            }, {
                once: !0
            }),
            a.style.setProperty("--x", `${a.offsetX}px`),
            a.style.setProperty("--y", `${a.offsetY}px`)
        })
    }
},
positionAll = function(positions) {
    let selectedPosition = Object.keys(positions)[0];
    let e = window.innerWidth,
        t = window.innerHeight,
        s = Array.from(document.querySelectorAll("draggable-element"));
    for (let o of s) {
        let i = positions[selectedPosition][o.id];
        console.log(i);
        if (!i)
            continue;
        let a = i.windowWidth,
            m = i.windowHeight,
            D = i.left + .5 * i.width - .5 * a,
            b = i.top + .5 * i.height - .5 * m,
            r = e - a,
            h = t - m,
            g = D * (1 + r / a),
            p = b * (1 + h / m);
        o.offsetX = g - .5 * i.width + .5 * e,
        o.offsetY = p - .5 * i.height + .5 * t,
        o.style.setProperty("--x", `${o.offsetX}px`),
        o.style.setProperty("--y", `${o.offsetY}px`),
        o.style.zIndex = String(i.zIndex)
    }
}

positionAll(vt);
transitionIn();