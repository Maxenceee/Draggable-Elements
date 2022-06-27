function f(n, e, t) {
    var s,
        o,
        i,
        a = arguments,
        m = {};
    for (i in e)
        i == "key" ? s = e[i] : i == "ref" ? o = e[i] : m[i] = e[i];
    if (arguments.length > 3)
        for (t = [t], i = 3; i < arguments.length; i++)
            t.push(a[i]);
    if (t != null && (m.children = t), typeof n == "function" && n.defaultProps != null)
        for (i in n.defaultProps)
            m[i] === void 0 && (m[i] = n.defaultProps[i]);
    return G(n, m, s, o, null)
}

function G(n, e) {
    let a = document.createElement(n);
    e.children && (e.children.map(e => {
        a.appendChild(e);
    }), delete e.children)
    Object.keys(e).forEach(u => {
        e[u] && a.setAttribute(u, e[u]);
    });
    return a
}

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
    constructor(e) {
        super(e);
        this.id = 0;
        this.addItem = this.addItem.bind(this),
        this.base = this.querySelector('.reminders-list-items'),
        this.scrollContainerRef = this.querySelector('.panel-content');
    }
    addItem() {
        this.id++;
        let a = f("div", {
            class: "reminders-list-item",
            "data-nodrag": !0
        }, f("input", {
            type: "checkbox",
            checked: !1
        }), f("input", {
            type: "text",
            "data-id": this.id
        }))
        console.log(a);
        this.base.appendChild(a);
        let t = this,
            s = this.scrollContainerRef,
            o = a.querySelector('input[type="text"]');
        s && s.scrollTo(0, s.scrollHeight),
        o && o.focus()
    }
    removeItem(e) {
    }
    connectedCallback() {
        console.log('render');
        this.querySelector('.reminders-list-btn').onclick = () => this.addItem()
    }
}

customElements.define('custom-reminder', be);

var xt = document.createElement("template");
xt.innerHTML = `
	<style>
		div {
			position: relative;
		}
		button {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			border: none;
			background: transparent;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			cursor: pointer;
			transition: opacity 150ms ease;
			outline: none;
			z-index: 1;
		}
		button:hover {
			opacity: 0.7;
		}
		button path {
			-webkit-backdrop-filter: blur(8px);
			backdrop-filter: blur(8px);
		}
	</style>
	<div>
		<slot></slot>
		<button aria-label="Play">
			<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M51 74C65.9117 74 78 61.9117 78 47C78 32.0883 65.9117 20 51 20C36.0883 20 24 32.0883 24 47C24 61.9117 36.0883 74 51 74ZM63.3276 48.6051C64.5688 47.82 64.5688 46.0096 63.3276 45.2245L47.0691 34.9412C45.7374 34.0989 44 35.0558 44 36.6314L44 57.1981C44 58.7738 45.7374 59.7307 47.0691 58.8884L63.3276 48.6051Z" fill="#FDFDFD" fill-opacity="0.8"/>
			</svg>
		</button>
	</div>
`;

var Mt = class extends HTMLElement {
    constructor() {
        super();
        this.toggleVideo = this.toggleVideo.bind(this),
        this.playVideo = this.playVideo.bind(this),
        this.pauseVideo = this.pauseVideo.bind(this),
        this.attachShadow({
            mode: "open"
        }),
        this.shadowRoot.appendChild(xt.content.cloneNode(!0))
    }
    connectedCallback() {
        this.video = this.querySelector("video"),
        this.button = this.shadowRoot.querySelector("button"),
        this.video.addEventListener("ended", this.handleVideoEnded),
        this.video.addEventListener("click", this.toggleVideo),
        this.button.addEventListener("click", this.playVideo),
        this.setAttribute("paused", "")
    }
    disconnectedCallback() {
        this.video.removeEventListener("ended", this.handleVideoEnded),
        this.video.removeEventListener("click", this.toggleVideo),
        this.button.removeEventListener("click", this.playVideo)
    }
    handleVideoEnded() {
        this.button.hidden = !1
    }
    toggleVideo() {
        this.video.paused ? this.playVideo() : this.pauseVideo()
    }
    playVideo() {
        this.video.play().then(() => {
            this.button.hidden = !0,
            this.removeAttribute("paused"),
            this.setAttribute("has-started", "")
        }).catch(e => {
            console.error(e)
        })
    }
    pauseVideo() {
        this.video.pause(),
        this.button.hidden = !1,
        this.setAttribute("paused", "")
    }
}

customElements.define("video-player", Mt);

var vt = {
    default: {
        "panel-reminders": {
            left: 600,
            top: 50,
            width: 0,
            height: 0,
            windowWidth: 1680,
            windowHeight: 945,
            zIndex: 1
        },
        "panel-showreel": {
            left: 150,
            top: 100,
            width: 0,
            height: 0,
            windowWidth: 1680,
            windowHeight: 945,
            zIndex: 2
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