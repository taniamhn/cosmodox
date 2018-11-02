import{IronFormElementBehavior,IronValidatableBehavior,IronButtonState,IronControlState,PaperRippleBehavior,Polymer,html$1 as html,afterNextRender,PolymerElement,ThemableMixin,ElementMixin,TextFieldMixin,resetMouseCanceller,LitElement,html as html$1,ApolloQuery,ApolloMutation,fileIcon,addIcon,editIcon,PageViewElement,SharedStyles}from"./my-app.js";const IronCheckedElementBehaviorImpl={properties:{checked:{type:Boolean,value:!1,reflectToAttribute:!0,notify:!0,observer:"_checkedChanged"},toggles:{type:Boolean,value:!0,reflectToAttribute:!0},value:{type:String,value:"on",observer:"_valueChanged"}},observers:["_requiredChanged(required)"],created:function(){this._hasIronCheckedElementBehavior=!0},_getValidity:function(){return this.disabled||!this.required||this.checked},_requiredChanged:function(){if(this.required){this.setAttribute("aria-required","true")}else{this.removeAttribute("aria-required")}},_checkedChanged:function(){this.active=this.checked;this.fire("iron-change")},_valueChanged:function(){if(this.value===void 0||null===this.value){this.value="on"}}},IronCheckedElementBehavior=[IronFormElementBehavior,IronValidatableBehavior,IronCheckedElementBehaviorImpl];var ironCheckedElementBehavior={IronCheckedElementBehaviorImpl:IronCheckedElementBehaviorImpl,IronCheckedElementBehavior:IronCheckedElementBehavior};const PaperInkyFocusBehaviorImpl={observers:["_focusedChanged(receivedFocusFromKeyboard)"],_focusedChanged:function(receivedFocusFromKeyboard){if(receivedFocusFromKeyboard){this.ensureRipple()}if(this.hasRipple()){this._ripple.holdDown=receivedFocusFromKeyboard}},_createRipple:function(){var ripple=PaperRippleBehavior._createRipple();ripple.id="ink";ripple.setAttribute("center","");ripple.classList.add("circle");return ripple}},PaperInkyFocusBehavior=[IronButtonState,IronControlState,PaperRippleBehavior,PaperInkyFocusBehaviorImpl];var paperInkyFocusBehavior={PaperInkyFocusBehaviorImpl:PaperInkyFocusBehaviorImpl,PaperInkyFocusBehavior:PaperInkyFocusBehavior};const PaperCheckedElementBehaviorImpl={_checkedChanged:function(){IronCheckedElementBehaviorImpl._checkedChanged.call(this);if(this.hasRipple()){if(this.checked){this._ripple.setAttribute("checked","")}else{this._ripple.removeAttribute("checked")}}},_buttonStateChanged:function(){PaperRippleBehavior._buttonStateChanged.call(this);if(this.disabled){return}if(this.isAttached){this.checked=this.active}}},PaperCheckedElementBehavior=[PaperInkyFocusBehavior,IronCheckedElementBehavior,PaperCheckedElementBehaviorImpl];var paperCheckedElementBehavior={PaperCheckedElementBehaviorImpl:PaperCheckedElementBehaviorImpl,PaperCheckedElementBehavior:PaperCheckedElementBehavior};const template=html`<style>
  :host {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);
    /* -1px is a sentinel for the default and is replaced in \`attached\`. */
    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);
    @apply --paper-font-common-base;
    line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus) {
    outline: none;
  }

  .hidden {
    display: none;
  }

  #checkboxContainer {
    display: inline-block;
    position: relative;
    width: var(--calculated-paper-checkbox-size);
    height: var(--calculated-paper-checkbox-size);
    min-width: var(--calculated-paper-checkbox-size);
    margin: var(--paper-checkbox-margin, initial);
    vertical-align: var(--paper-checkbox-vertical-align, middle);
    background-color: var(--paper-checkbox-unchecked-background-color, transparent);
  }

  #ink {
    position: absolute;

    /* Center the ripple in the checkbox by negative offsetting it by
     * (inkWidth - rippleWidth) / 2 */
    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    width: var(--calculated-paper-checkbox-ink-size);
    height: var(--calculated-paper-checkbox-ink-size);
    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));
    opacity: 0.6;
    pointer-events: none;
  }

  #ink:dir(rtl) {
    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: auto;
  }

  #ink[checked] {
    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));
  }

  #checkbox {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    border: solid 2px;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    border-radius: 2px;
    pointer-events: none;
    -webkit-transition: background-color 140ms, border-color 140ms;
    transition: background-color 140ms, border-color 140ms;

    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);
    transition-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  /* checkbox checked animations */
  #checkbox.checked #checkmark {
    -webkit-animation: checkmark-expand 140ms ease-out forwards;
    animation: checkmark-expand 140ms ease-out forwards;

    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);
    animation-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  @-webkit-keyframes checkmark-expand {
    0% {
      -webkit-transform: scale(0, 0) rotate(45deg);
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(45deg);
    }
  }

  @keyframes checkmark-expand {
    0% {
      transform: scale(0, 0) rotate(45deg);
    }
    100% {
      transform: scale(1, 1) rotate(45deg);
    }
  }

  #checkbox.checked {
    background-color: var(--paper-checkbox-checked-color, var(--primary-color));
    border-color: var(--paper-checkbox-checked-color, var(--primary-color));
  }

  #checkmark {
    position: absolute;
    width: 36%;
    height: 70%;
    border-style: solid;
    border-top: none;
    border-left: none;
    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-color: var(--paper-checkbox-checkmark-color, white);
    -webkit-transform-origin: 97% 86%;
    transform-origin: 97% 86%;
    box-sizing: content-box; /* protect against page-level box-sizing */
  }

  #checkmark:dir(rtl) {
    -webkit-transform-origin: 50% 14%;
    transform-origin: 50% 14%;
  }

  /* label */
  #checkboxLabel {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: var(--paper-checkbox-label-spacing, 8px);
    white-space: normal;
    line-height: normal;
    color: var(--paper-checkbox-label-color, var(--primary-text-color));
    @apply --paper-checkbox-label;
  }

  :host([checked]) #checkboxLabel {
    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));
    @apply --paper-checkbox-label-checked;
  }

  #checkboxLabel:dir(rtl) {
    padding-right: var(--paper-checkbox-label-spacing, 8px);
    padding-left: 0;
  }

  #checkboxLabel[hidden] {
    display: none;
  }

  /* disabled state */

  :host([disabled]) #checkbox {
    opacity: 0.5;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
  }

  :host([disabled][checked]) #checkbox {
    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    opacity: 0.5;
  }

  :host([disabled]) #checkboxLabel  {
    opacity: 0.65;
  }

  /* invalid state */
  #checkbox.invalid:not(.checked) {
    border-color: var(--paper-checkbox-error-color, var(--error-color));
  }
</style>

<div id="checkboxContainer">
  <div id="checkbox" class$="[[_computeCheckboxClass(checked, invalid)]]">
    <div id="checkmark" class$="[[_computeCheckmarkClass(checked)]]"></div>
  </div>
</div>

<div id="checkboxLabel"><slot></slot></div>`;template.setAttribute("strip-whitespace","");Polymer({_template:template,is:"paper-checkbox",behaviors:[PaperCheckedElementBehavior],hostAttributes:{role:"checkbox","aria-checked":!1,tabindex:0},properties:{ariaActiveAttribute:{type:String,value:"aria-checked"}},attached:function(){afterNextRender(this,function(){var inkSize=this.getComputedStyleValue("--calculated-paper-checkbox-ink-size").trim();if("-1px"===inkSize){var checkboxSizeText=this.getComputedStyleValue("--calculated-paper-checkbox-size").trim(),units="px",unitsMatches=checkboxSizeText.match(/[A-Za-z]+$/);if(null!==unitsMatches){units=unitsMatches[0]}var checkboxSize=parseFloat(checkboxSizeText),defaultInkSize=8/3*checkboxSize;if("px"===units){defaultInkSize=Math.floor(defaultInkSize);if(defaultInkSize%2!==checkboxSize%2){defaultInkSize++}}this.updateStyles({"--paper-checkbox-ink-size":defaultInkSize+units})}})},_computeCheckboxClass:function(checked,invalid){var className="";if(checked){className+="checked "}if(invalid){className+="invalid"}return className},_computeCheckmarkClass:function(checked){return checked?"":"hidden"},_createRipple:function(){this._rippleContainer=this.$.checkboxContainer;return PaperInkyFocusBehaviorImpl._createRipple.call(this)}});const ProgressMixin=superClass=>class extends superClass{static get properties(){return{value:{type:Number,observer:"_valueChanged"},min:{type:Number,value:0,observer:"_minChanged"},max:{type:Number,value:1,observer:"_maxChanged"},indeterminate:{type:Boolean,value:!1,reflectToAttribute:!0}}}static get observers(){return["_normalizedValueChanged(value, min, max)"]}ready(){super.ready();this.setAttribute("role","progressbar")}_normalizedValueChanged(value,min,max){const newNormalizedValue=this._normalizeValue(value,min,max);this.style.setProperty("--vaadin-progress-value",newNormalizedValue);this.updateStyles({"--vaadin-progress-value":newNormalizedValue+""})}_valueChanged(newV){this.setAttribute("aria-valuenow",newV)}_minChanged(newV){this.setAttribute("aria-valuemin",newV)}_maxChanged(newV){this.setAttribute("aria-valuemax",newV)}_normalizeValue(value,min,max){let nV;if(!value&&0!=value){nV=0}else if(min>=max){nV=1}else{nV=(value-min)/(max-min);nV=Math.min(Math.max(nV,0),1)}return nV}};var vaadinProgressMixin={ProgressMixin:ProgressMixin};class ProgressBarElement extends ElementMixin(ThemableMixin(ProgressMixin(PolymerElement))){static get template(){return html`
    <style>
      :host {
        display: block;
        width: 100%; /* prevent collapsing inside non-stretching column flex */
        height: 8px;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part="bar"] {
        height: 100%;
      }

      [part="value"] {
        height: 100%;
        transform-origin: 0 50%;
        transform: scaleX(var(--vaadin-progress-value));
      }

    </style>

    <div part="bar">
      <div part="value"></div>
    </div>
`}static get is(){return"vaadin-progress-bar"}static get version(){return"1.1.0"}}customElements.define(ProgressBarElement.is,ProgressBarElement);var vaadinProgressBar={ProgressBarElement:ProgressBarElement};const $_documentContainer=document.createElement("template");$_documentContainer.innerHTML=`<dom-module id="material-progress-bar" theme-for="vaadin-progress-bar">
  <template>
    <style>
      :host {
        height: 4px;
        margin: 8px 0;
        position: relative;
        overflow: hidden;
      }

      :host::before {
        content: "";
        display: block;
        height: 100%;
        background-color: var(--material-primary-color);
        opacity: 0.16;
      }

      [part="bar"] {
        position: absolute;
        top: 0;
        width: 100%;
        transform: scaleX(var(--vaadin-progress-value));
        transform-origin: 0 0;
      }

      [part="value"] {
        transform: none;
        background-color: var(--material-primary-color);
      }

      /* Indeterminate */

      :host([indeterminate]) [part="bar"] {
        left: -100%;
        animation: primary-indeterminate-translate 2s infinite linear;
      }

      :host([indeterminate]) [part="value"] {
        animation: primary-indeterminate-scale 2s infinite linear;
      }

      @keyframes primary-indeterminate-translate {
        0% {
          transform: translateX(0);
        }

        20% {
          animation-timing-function: cubic-bezier(.5, 0, .701732, .495819);
          transform: translateX(0);
        }

        59.15% {
          animation-timing-function: cubic-bezier(.302435, .381352, .55, .956352);
          transform: translateX(83.67142%);
        }

        100% {
          transform: translateX(200.611057%);
        }
      }

      @keyframes primary-indeterminate-scale {
        0% {
          transform: scaleX(.08);
        }

        36.65% {
          animation-timing-function: cubic-bezier(.334731, .12482, .785844, 1);
          transform: scaleX(.08);
        }

        69.15% {
          animation-timing-function: cubic-bezier(.06, .11, .6, 1);
          transform: scaleX(.661479);
        }

        100% {
          transform: scaleX(.08);
        }
      }

    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer.content);class TextAreaElement extends ElementMixin(TextFieldMixin(ThemableMixin(PolymerElement))){static get template(){return html`
    <style include="vaadin-text-field-shared-styles">
      .vaadin-text-area-container {
        flex: auto;
        max-height: inherit; /* MSIE 11 */
        min-height: inherit; /* MSIE 11 */
      }

      /* The label and the error message should neither grow nor shrink. */
      [part="label"],
      [part="error-message"] {
        flex: none;
      }

      [part="input-field"] {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }

      [part="value"] {
        resize: none;
      }

      [part="value"],
      [part="input-field"] ::slotted(*) {
        align-self: flex-start;
      }
    </style>

    <div class="vaadin-text-area-container">

      <label part="label" on-click="focus" id="[[_labelId]]">[[label]]</label>

      <div part="input-field">

        <slot name="prefix"></slot>

        <textarea part="value" autocomplete\$="[[autocomplete]]" autocorrect\$="[[autocorrect]]" autocapitalize\$="[[autocapitalize]]" autofocus\$="[[autofocus]]" disabled\$="[[disabled]]" maxlength\$="[[maxlength]]" minlength\$="[[minlength]]" placeholder\$="[[placeholder]]" readonly\$="[[readonly]]" aria-readonly\$="[[readonly]]" required\$="[[required]]" aria-required\$="[[required]]" value="{{value::input}}" on-blur="validate" on-input="_onInput" on-change="_onChange" aria-describedby\$="[[_getActiveErrorId(invalid, errorMessage, _errorId)]]" aria-labelledby\$="[[_getActiveLabelId(label, _labelId)]]" aria-invalid\$="[[invalid]]"></textarea>

        <slot name="suffix"></slot>

      </div>

      <div part="error-message" id="[[_errorId]]" aria-live="assertive" aria-hidden\$="[[_getErrorMessageAriaHidden(invalid, errorMessage, _errorId)]]">[[errorMessage]]</div>

    </div>
`}static get is(){return"vaadin-text-area"}static get version(){return"2.1.2"}static get observers(){return["_textAreaValueChanged(value)"]}ready(){super.ready();this._updateHeight()}_textAreaValueChanged(){this._updateHeight()}_updateHeight(){const inputField=this.root.querySelector("[part=input-field]"),scrollTop=inputField.scrollTop,input=this.focusElement,inputWidth=getComputedStyle(input).width,valueLength=this.value?this.value.length:0;if(this._oldValueLength>=valueLength){input.style.maxWidth=inputWidth;input.style.height="auto";inputField.style.display="block"}this._oldValueLength=valueLength;const inputHeight=input.scrollHeight;if(inputHeight>input.clientHeight){input.style.height=inputHeight+"px"}input.style.removeProperty("max-width");inputField.style.removeProperty("display");inputField.scrollTop=scrollTop}}customElements.define(TextAreaElement.is,TextAreaElement);var vaadinTextArea={TextAreaElement:TextAreaElement};const $_documentContainer$1=document.createElement("template");$_documentContainer$1.innerHTML=`<dom-module id="material-text-area" theme-for="vaadin-text-area">
  <template>
    <style include="material-text-field">
      [part="input-field"] {
        height: auto;
        box-sizing: border-box;
      }

      /* NOTE(platosha): double attribute workarounds specifity for Firefox */
      [part="value"][part="value"] {
        padding-top: 0;
        margin-top: 4px;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$1.content);const $_documentContainer$2=document.createElement("template");$_documentContainer$2.innerHTML=`<custom-style>
  <style>
    @font-face {
      font-family: 'vaadin-upload-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,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) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$2.content);class UploadFileElement extends ThemableMixin(PolymerElement){static get template(){return html`
    <style>
      :host {
        display: block;
      }

      [hidden] {
        display: none;
      }
    </style>

    <div part="row">
      <div part="info">
        <div part="done-icon" hidden\$="[[!file.complete]]"></div>
        <div part="warning-icon" hidden\$="[[!file.error]]"></div>

        <div part="meta">
          <div part="name" id="name">[[file.name]]</div>
          <div part="status" hidden\$="[[!file.status]]" id="status">[[file.status]]</div>
          <div part="error" id="error" hidden\$="[[!file.error]]">[[file.error]]</div>
        </div>
      </div>
      <div part="commands">
        <div part="start-button" file-event="file-start" on-click="_fireFileEvent" hidden\$="[[!file.held]]"></div>
        <div part="retry-button" file-event="file-retry" on-click="_fireFileEvent" hidden\$="[[!file.error]]"></div>
        <div part="clear-button" file-event="file-abort" on-click="_fireFileEvent"></div>
      </div>
    </div>

    <vaadin-progress-bar part="progress" id="progress" value\$="[[_formatProgressValue(file.progress)]]" error\$="[[file.error]]" indeterminate\$="[[file.indeterminate]]" uploading\$="[[file.uploading]]" complete\$="[[file.complete]]">
    </vaadin-progress-bar>
`}static get is(){return"vaadin-upload-file"}static get properties(){return{file:Object}}static get observers(){return["_fileAborted(file.abort)","_toggleHostAttribute(file.error, \"error\")","_toggleHostAttribute(file.indeterminate, \"indeterminate\")","_toggleHostAttribute(file.uploading, \"uploading\")","_toggleHostAttribute(file.complete, \"complete\")"]}_fileAborted(abort){if(abort){this._remove()}}_remove(){this.dispatchEvent(new CustomEvent("file-remove",{detail:{file:this.file},bubbles:!0,composed:!0}))}_formatProgressValue(progress){return progress/100}_fireFileEvent(e){e.preventDefault();return this.dispatchEvent(new CustomEvent(e.target.getAttribute("file-event"),{detail:{file:this.file},bubbles:!0,composed:!0}))}_toggleHostAttribute(value,attributeName){const shouldHave=!!value,has=this.hasAttribute(attributeName);if(has!==shouldHave){if(shouldHave){this.setAttribute(attributeName,"")}else{this.removeAttribute(attributeName)}}}}customElements.define(UploadFileElement.is,UploadFileElement);var vaadinUploadFile={UploadFileElement:UploadFileElement};class UploadElement extends ElementMixin(ThemableMixin(PolymerElement)){static get template(){return html`
    <style>
      :host {
        display: block;
        position: relative;
      }

      :host([hidden]) {
        display: none !important;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <div part="primary-buttons">
      <div id="addFiles" on-touchend="_onAddFilesTouchEnd" on-click="_onAddFilesClick">
        <slot name="add-button">
          <vaadin-button part="upload-button" id="addButton" disabled="[[maxFilesReached]]">
            [[_i18nPlural(maxFiles, i18n.addFiles, i18n.addFiles.*)]]
          </vaadin-button>
        </slot>
      </div>
      <div part="drop-label" hidden\$="[[nodrop]]" id="dropLabelContainer">
        <slot name="drop-label-icon">
          <div part="drop-label-icon"></div>
        </slot>
        <slot name="drop-label" id="dropLabel">
          [[_i18nPlural(maxFiles, i18n.dropFiles, i18n.dropFiles.*)]]
        </slot>
      </div>
    </div>
    <slot name="file-list">
      <div id="fileList" part="file-list">
        <template is="dom-repeat" items="[[files]]" as="file">
          <vaadin-upload-file file="[[file]]"></vaadin-upload-file>
        </template>
      </div>
    </slot>
    <slot></slot>
    <input type="file" id="fileInput" on-change="_onFileInputChange" hidden="" accept\$="{{accept}}" multiple\$="[[_isMultiple(maxFiles)]]" capture\$="[[capture]]">
`}static get is(){return"vaadin-upload"}static get version(){return"4.2.1"}static get properties(){return{nodrop:{type:Boolean,reflectToAttribute:!0,value:function(){try{return!!document.createEvent("TouchEvent")}catch(e){return!1}}},target:{type:String,value:""},method:{type:String,value:"POST"},headers:{type:Object,value:{}},timeout:{type:Number,value:0},_dragover:{type:Boolean,value:!1,observer:"_dragoverChanged"},files:{type:Array,notify:!0,value:function(){return[]}},maxFiles:{type:Number,value:1/0},maxFilesReached:{type:Boolean,value:!1,notify:!0,readOnly:!0,computed:"_maxFilesAdded(maxFiles, files.length)"},accept:{type:String,value:""},maxFileSize:{type:Number,value:1/0},_dragoverValid:{type:Boolean,value:!1,observer:"_dragoverValidChanged"},formDataName:{type:String,value:"file"},noAuto:{type:Boolean,value:!1},withCredentials:{type:Boolean,value:!1},capture:String,i18n:{type:Object,value:function(){return{dropFiles:{one:"Drop file here",many:"Drop files here"},addFiles:{one:"Upload File...",many:"Upload Files..."},cancel:"Cancel",error:{tooManyFiles:"Too Many Files.",fileIsTooBig:"File is Too Big.",incorrectFileType:"Incorrect File Type."},uploading:{status:{connecting:"Connecting...",stalled:"Stalled.",processing:"Processing File...",held:"Queued"},remainingTime:{prefix:"remaining time: ",unknown:"unknown remaining time"},error:{serverUnavailable:"Server Unavailable",unexpectedServerError:"Unexpected Server Error",forbidden:"Forbidden"}},units:{size:["B","kB","MB","GB","TB","PB","EB","ZB","YB"]}}}}}}ready(){super.ready();this.addEventListener("dragover",this._onDragover.bind(this));this.addEventListener("dragleave",this._onDragleave.bind(this));this.addEventListener("drop",this._onDrop.bind(this));this.addEventListener("file-retry",this._onFileRetry.bind(this));this.addEventListener("file-abort",this._onFileAbort.bind(this));this.addEventListener("file-remove",this._onFileRemove.bind(this));this.addEventListener("file-start",this._onFileStart.bind(this))}_formatSize(bytes){var _Mathlog=Math.log;if("function"===typeof this.i18n.formatSize){return this.i18n.formatSize(bytes)}const base=this.i18n.units.sizeBase||1e3,unit=~~(_Mathlog(bytes)/_Mathlog(base)),dec=Math.max(0,Math.min(3,unit-1)),size=parseFloat((bytes/Math.pow(base,unit)).toFixed(dec));return size+" "+this.i18n.units.size[unit]}_splitTimeByUnits(time){const unitSizes=[60,60,24,1/0],timeValues=[0];for(var i=0;i<unitSizes.length&&0<time;i++){timeValues[i]=time%unitSizes[i];time=Math.floor(time/unitSizes[i])}return timeValues}_formatTime(seconds,split){if("function"===typeof this.i18n.formatTime){return this.i18n.formatTime(seconds,split)}while(3>split.length){split.push(0)}return split.reverse().map(number=>{return(10>number?"0":"")+number}).join(":")}_formatFileProgress(file){return file.totalStr+": "+file.progress+"% ("+(0<file.loaded?this.i18n.uploading.remainingTime.prefix+file.remainingStr:this.i18n.uploading.remainingTime.unknown)+")"}_maxFilesAdded(maxFiles,numFiles){return 0<=maxFiles&&numFiles>=maxFiles}_onDragover(event){event.preventDefault();if(!this.nodrop&&!this._dragover){this._dragoverValid=!this.maxFilesReached;this._dragover=!0}event.dataTransfer.dropEffect=!this._dragoverValid||this.nodrop?"none":"copy"}_onDragleave(event){event.preventDefault();if(this._dragover&&!this.nodrop){this._dragover=this._dragoverValid=!1}}_onDrop(event){if(!this.nodrop){event.preventDefault();this._dragover=this._dragoverValid=!1;this._addFiles(event.dataTransfer.files)}}_createXhr(){return new XMLHttpRequest}_configureXhr(xhr){if("string"==typeof this.headers){try{this.headers=JSON.parse(this.headers)}catch(e){this.headers=void 0}}for(var key in this.headers){xhr.setRequestHeader(key,this.headers[key])}if(this.timeout){xhr.timeout=this.timeout}xhr.withCredentials=this.withCredentials}_setStatus(file,total,loaded,elapsed){file.elapsed=elapsed;file.elapsedStr=this._formatTime(file.elapsed,this._splitTimeByUnits(file.elapsed));file.remaining=Math.ceil(elapsed*(total/loaded-1));file.remainingStr=this._formatTime(file.remaining,this._splitTimeByUnits(file.remaining));file.speed=~~(total/elapsed/1024);file.totalStr=this._formatSize(total);file.loadedStr=this._formatSize(loaded);file.status=this._formatFileProgress(file)}uploadFiles(files){files=files||this.files;files=files.filter(file=>!file.complete);Array.prototype.forEach.call(files,this._uploadFile.bind(this))}_uploadFile(file){if(file.uploading){return}const ini=Date.now(),xhr=file.xhr=this._createXhr(file);let stalledId,last;xhr.upload.onprogress=e=>{clearTimeout(stalledId);last=Date.now();const elapsed=(last-ini)/1e3,loaded=e.loaded,total=e.total,progress=~~(100*(loaded/total));file.loaded=loaded;file.progress=progress;file.indeterminate=0>=loaded||loaded>=total;if(file.error){file.indeterminate=file.status=void 0}else if(!file.abort){if(100>progress){this._setStatus(file,total,loaded,elapsed);stalledId=setTimeout(()=>{file.status=this.i18n.uploading.status.stalled;this._notifyFileChanges(file)},2e3)}else{file.loadedStr=file.totalStr;file.status=this.i18n.uploading.status.processing;file.uploading=!1}}this._notifyFileChanges(file);this.dispatchEvent(new CustomEvent("upload-progress",{detail:{file,xhr}}))};xhr.onreadystatechange=()=>{if(4==xhr.readyState){clearTimeout(stalledId);file.indeterminate=file.uploading=!1;if(file.abort){this._notifyFileChanges(file);return}file.status="";const evt=this.dispatchEvent(new CustomEvent("upload-response",{detail:{file,xhr},cancelable:!0}));if(!evt){return}if(0===xhr.status){file.error=this.i18n.uploading.error.serverUnavailable}else if(500<=xhr.status){file.error=this.i18n.uploading.error.unexpectedServerError}else if(400<=xhr.status){file.error=this.i18n.uploading.error.forbidden}file.complete=!file.error;this.dispatchEvent(new CustomEvent(`upload-${file.error?"error":"success"}`,{detail:{file,xhr}}));this._notifyFileChanges(file)}};const formData=new FormData;file.uploadTarget=this.target||"";file.formDataName=this.formDataName;const evt=this.dispatchEvent(new CustomEvent("upload-before",{detail:{file,xhr},cancelable:!0}));if(!evt){return}formData.append(file.formDataName,file,file.name);xhr.open(this.method,file.uploadTarget,!0);this._configureXhr(xhr);file.status=this.i18n.uploading.status.connecting;file.uploading=file.indeterminate=!0;file.complete=file.abort=file.error=file.held=!1;xhr.upload.onloadstart=()=>{this.dispatchEvent(new CustomEvent("upload-start",{detail:{file,xhr}}));this._notifyFileChanges(file)};const uploadEvt=this.dispatchEvent(new CustomEvent("upload-request",{detail:{file,xhr,formData},cancelable:!0}));if(uploadEvt){xhr.send(formData)}}_retryFileUpload(file){const evt=this.dispatchEvent(new CustomEvent("upload-retry",{detail:{file,xhr:file.xhr},cancelable:!0}));if(evt){this._uploadFile(file)}}_abortFileUpload(file){const evt=this.dispatchEvent(new CustomEvent("upload-abort",{detail:{file,xhr:file.xhr},cancelable:!0}));if(evt){file.abort=!0;if(file.xhr){file.xhr.abort()}this._notifyFileChanges(file)}}_notifyFileChanges(file){var p="files."+this.files.indexOf(file)+".";for(var i in file){if(file.hasOwnProperty(i)){this.notifyPath(p+i,file[i])}}}_addFiles(files){Array.prototype.forEach.call(files,this._addFile.bind(this))}_addFile(file){if(this.maxFilesReached){this.dispatchEvent(new CustomEvent("file-reject",{detail:{file,error:this.i18n.error.tooManyFiles}}));return}if(0<=this.maxFileSize&&file.size>this.maxFileSize){this.dispatchEvent(new CustomEvent("file-reject",{detail:{file,error:this.i18n.error.fileIsTooBig}}));return}const fileExt=file.name.match(/\.[^\.]*$|$/)[0],re=new RegExp("^("+this.accept.replace(/[, ]+/g,"|").replace(/\/\*/g,"/.*")+")$","i");if(this.accept&&!(re.test(file.type)||re.test(fileExt))){this.dispatchEvent(new CustomEvent("file-reject",{detail:{file,error:this.i18n.error.incorrectFileType}}));return}file.loaded=0;file.held=!0;file.status=this.i18n.uploading.status.held;this.unshift("files",file);if(!this.noAuto){this._uploadFile(file)}}_removeFile(file){if(-1<this.files.indexOf(file)){this.splice("files",this.files.indexOf(file),1)}}_onAddFilesTouchEnd(e){e.preventDefault();this.__resetMouseCanceller();this._onAddFilesClick()}__resetMouseCanceller(){resetMouseCanceller()}_onAddFilesClick(){if(this.maxFilesReached){return}this.$.fileInput.value="";this.$.fileInput.click()}_onFileInputChange(event){this._addFiles(event.target.files)}_onFileStart(event){this._uploadFile(event.detail.file)}_onFileRetry(event){this._retryFileUpload(event.detail.file)}_onFileAbort(event){this._abortFileUpload(event.detail.file)}_onFileRemove(event){event.stopPropagation();this._removeFile(event.detail.file)}_dragoverChanged(dragover){dragover?this.setAttribute("dragover",dragover):this.removeAttribute("dragover")}_dragoverValidChanged(dragoverValid){dragoverValid?this.setAttribute("dragover-valid",dragoverValid):this.removeAttribute("dragover-valid")}_i18nPlural(value,plural){return 1==value?plural.one:plural.many}_isMultiple(){return 1!=this.maxFiles}}customElements.define(UploadElement.is,UploadElement);var vaadinUpload={UploadElement:UploadElement};const $_documentContainer$3=document.createElement("template");$_documentContainer$3.innerHTML=`<dom-module id="material-upload" theme-for="vaadin-upload">
  <template>
    <style>
      :host(:not([nodrop])) {
        overflow: hidden;
        border: 1px dashed var(--material-divider-color);
        border-radius: 4px;
        padding: 8px 16px;
        transition: border-color 0.6s;
        position: relative;
      }

      [part="primary-buttons"] {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: baseline;
      }

      /* TODO(jouni): unsupported selector (not sure why there's #addFiles element wrapping the upload button) */
      [part="primary-buttons"] > * {
        display: block;
        flex-grow: 1;
      }

      [part="upload-button"] {
        display: block;
        margin: 0 -8px;
      }

      [part="drop-label"] {
        text-align: center;
        white-space: normal;
        padding: 0 24px;
        color: var(--material-secondary-text-color);
        font-family: var(--material-font-family);
        font-size: var(--material-small-font-size);
      }

      :host([dragover-valid]) {
        border-color: var(--material-primary-color);
        transition: border-color 0.1s;
      }

      :host([dragover-valid]) [part="drop-label"] {
        color: var(--material-primary-text-color);
      }

      [part="drop-label-icon"] {
        display: inline-block;
        margin-right: 8px;
      }

      [part="drop-label-icon"]::before {
        content: var(--material-icons-upload);
        font-family: material-icons;
        font-size: var(--material-icon-font-size);
        line-height: 1;
      }

      /* Ripple */

      :host::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        pointer-events: none;
        background-color: var(--material-primary-color);
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0s cubic-bezier(.075, .82, .165, 1), opacity 0.4s linear;
        transition-delay: 0.4s, 0s;
      }

      :host([dragover-valid])::before {
        transform: translate(-50%, -50%) scale(10);
        opacity: 0.1;
        transition-duration: 2s, 0.1s;
        transition-delay: 0s, 0s;
      }
    </style>
  </template>
</dom-module><dom-module id="material-upload-file" theme-for="vaadin-upload-file">
  <template>
    <style>
      :host {
        padding: 8px 0;
      }

      [part="row"] {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      [part="status"],
      [part="error"] {
        color: var(--material-secondary-text-color);
        font-size: var(--material-caption-font-size);
      }

      [part="info"] {
        display: flex;
        align-items: baseline;
        flex: auto;
      }

      [part="meta"] {
        width: 0.001px;
        flex: 1 1 auto;
      }

      [part="name"] {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: var(--material-small-font-size);
      }

      [part="commands"] {
        display: flex;
        flex: none;
        font-family: material-icons;
        font-size: var(--material-icon-font-size);
      }

      [part="done-icon"],
      [part="warning-icon"] {
        padding: 8px;
        margin: -8px 0 -8px -8px;
        font-family: material-icons;
        font-size: var(--material-icon-font-size);
      }

      /* When both icons are hidden, let us keep space for one */
      [part="done-icon"][hidden] + [part="warning-icon"][hidden] {
        display: block !important;
        visibility: hidden;
      }

      [part="done-icon"],
      [part="warning-icon"] {
        font-size: var(--material-icon-font-size);
        line-height: 1;
      }

      [part="start-button"],
      [part="retry-button"],
      [part="clear-button"] {
        flex: none;
        color: var(--material-secondary-text-color);
        line-height: 1;
        padding: 8px;
        margin: -8px 0;
      }

      [part="clear-button"] {
        margin-right: -8px;
      }

      [part="start-button"]:hover,
      [part="retry-button"]:hover,
      [part="clear-button"]:hover {
        color: inherit;
      }

      [part="done-icon"]::before,
      [part="warning-icon"]::before,
      [part="start-button"]::before,
      [part="retry-button"]::before,
      [part="clear-button"]::before {
        vertical-align: -0.05em;
      }

      [part="done-icon"]::before {
        content: var(--material-icons-check);
        color: var(--material-primary-text-color);
      }

      [part="warning-icon"]::before {
        content: var(--material-icons-error);
        color: var(--material-error-text-color);
      }

      [part="start-button"]::before {
        content: var(--material-icons-play);
      }

      [part="retry-button"]::before {
        content: var(--material-icons-reload);
      }

      [part="clear-button"]::before {
        content: var(--material-icons-clear);
      }

      [part="error"] {
        color: var(--material-error-text-color);
      }

      [part="progress"] {
        width: auto;
        margin-left: 28px;
      }

      [part="progress"][complete],
      [part="progress"][error] {
        display: none;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$3.content);const commentInfo=comment=>{const{content,createdAt,createdBy}=comment;return html$1`
    <div>
      <p>${content}</p>
      <time>${createdAt}</time>
      <span>${createdBy.fullName}</span>
    </div>
  `};class CommentList extends LitElement{render(){const{comments}=this;return html$1`
      <style>
        :host {
          display: block;
        }

        p {
          margin: 0;
        }

        li {
          padding: 10px;
          border: 1px solid;
          border-radius: 10px;
          margin-bottom: 10px;
          list-style-type: none;
        }
      </style>
      <ul>
        ${comments.map(comment=>html$1`<li>${commentInfo(comment)}</li>`)}
      </ul>
    `}static get properties(){return{comments:{type:Array}}}constructor(){super();this.comments=[]}}window.customElements.define("comment-list",CommentList);const createMutation=Apollo.gql`
  mutation createProjectUpdateComment($input: ProjectUpdateCommentCreateGenericType!) {
    createProjectUpdateComment(input: $input) {
      ok
      errors { field, messages }
    }
  }
`,commentButtonText=loading=>html$1`${loading?html$1`<concrete-loading-icon></concrete-loading-icon>`:"Comentar"}`;class NewProjectUpdateComment extends ApolloMutation{render(){const{loading}=this;return html$1`
      <style>
        form {
          display: grid;
        }
      </style>
      <paper-textarea required></paper-textarea>
      <vaadin-button @click="${()=>this.comment()}">${commentButtonText(loading)}</vaadin-button>
    `}static get properties(){return{projectUpdateId:{type:String}}}constructor(){super();this.client=Apollo.client;this.mutation=createMutation;this.refetchQueries=["projectUpdateComments"];this.onCompleted=data=>{const{ok}=data.createProjectUpdateComment;if(ok){this.shadowRoot.querySelector("paper-textarea").value=""}}}_mutationData({projectUpdate,content}={}){return{input:{projectUpdate,content}}}comment(){const textarea=this.shadowRoot.querySelector("paper-textarea");if(textarea.validate()){this.variables=this._mutationData({projectUpdate:this.projectUpdateId,content:textarea.value});this.mutate()}}}window.customElements.define("new-project-update-comment",NewProjectUpdateComment);const commentsQuery=Apollo.gql`
  query projectUpdateComments($projectUpdate: ID!) {
    projectUpdateComments(projectUpdate: $projectUpdate) {
      results {
        id
        content
        createdAt
        createdBy { id, fullName }
      }
    }
  }
`;class ProjectUpdateComments extends ApolloQuery{render(){const{data,opened,_projectUpdateId}=this,comments=data&&data.projectUpdateComments?data.projectUpdateComments:{results:[]};return html$1`
      <style>
        :host {
          display: block;
        }

        paper-dialog {
          width: 100%;
          height: 100%;
        }

        comment-list {
          height: 60vh;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Comentarios</h2>
        <paper-dialog-scrollable>
          <new-project-update-comment .projectUpdateId="${_projectUpdateId}"></new-project-update-comment>
          <comment-list .comments="${comments.results}"></comment-list>
        </paper-dialog-scrollable>
        <div class="buttons">
          <vaadin-button @click="${()=>{this.opened=!1}}">Cerrar</vaadin-button>
        </div>
      </paper-dialog>
    `}static get properties(){return{opened:{type:Boolean},_projectUpdateId:{type:String}}}constructor(){super();this.opened=!1;this.client=Apollo.client;this.query=commentsQuery}shouldUpdate(changedProperties){return changedProperties.has("opened")&&!!this.data||changedProperties.has("_projectUpdateId")&&!!this.data||super.shouldUpdate(changedProperties)}set projectUpdateId(id){this._projectUpdateId=id;this.variables={projectUpdate:id}}}window.customElements.define("project-update-comments",ProjectUpdateComments);const projectStateQuery=Apollo.gql`
  query projectStateCombo {
    states: __type(name: "ProjectStateEnum") {
      enumValues { value: name, description }
    }
  }
`;class ProjectStatesCombo extends ApolloQuery{render(){const{data,required}=this,states=data.states.enumValues;return html$1`
      <style>
        vaadin-combo-box {
          width: 100%;
        }
      </style>
      <vaadin-combo-box .items="${states}" ?required="${required}" .value="${this._value}" 
        label="Estado"  item-label-path="description" item-value-path="value" @change="${e=>{this.value=e.target.value}}">
      </vaadin-combo-box>
    `}static get properties(){return{_value:{type:String},required:{type:Boolean}}}constructor(){super();this.required=!1;this.client=Apollo.client;this.query=projectStateQuery}shouldUpdate(changedProperties){return super.shouldUpdate(changedProperties)||(changedProperties.has("_value")||changedProperties.has("required"))&&!!this.data}set value(value){this._value=value}get value(){return this._value}validate(){return this.shadowRoot.querySelector("vaadin-combo-box").validate()}}window.customElements.define("project-states-combo",ProjectStatesCombo);const fileElem=file=>{return html$1`
    <li class="file">
      <a target="blank" rel="external" href="${file.url}">
        <div>${fileIcon}</div>
        <span>${file.shortName}</span>
      </a>
    </li>
  `};class ProjectUpdateInfo extends LitElement{render(){const{projectUpdate}=this,{files=[]}=projectUpdate;return html$1`
      <style>
        :host {
          display: block;
        }

        :host > div {
          border-radius: 10px;
          border: 1px solid;
          padding: 10px;
        }

        p {
          margin: 0;
        }

        li {
          list-style-type: none;
        }

        a {
          color: var(--material-primary-color);
          text-decoration: none;
        }

        .file a {
          display: flex;
        }
      </style>
      <div>
        <p>${projectUpdate.content}</p>
        <ul>
          ${files.map(f=>fileElem(f.document))}
        </ul>
        <time>${projectUpdate.createdAt}</time>
        <span>${projectUpdate.createdBy.fullName}</span>
        <a @click="${e=>{this.fireOpenComments(e)}}">Ver comentarios</a>
      </div>
    `}static get properties(){return{projectUpdate:{type:Object}}}constructor(){super();this.projectUpdate={}}fireOpenComments(e){e.preventDefault();this.dispatchEvent(new CustomEvent("open-comments",{detail:{projectUpdate:this.projectUpdate.id}}))}}window.customElements.define("project-update-info",ProjectUpdateInfo);const createMutation$1=Apollo.gql`
  mutation createProjectUpdate($input: ProjectUpdateInput!) {
    createProjectUpdate(input: $input) {
      ok
      errors { field, messages }
    }
  }
`,createButtonText=loading=>html$1`${loading?html$1`<concrete-loading-icon></concrete-loading-icon>`:"Crear"}`;class NewProjectUpdate extends ApolloMutation{render(){const{opened,loading}=this;return html$1`
      <style>
        iron-form {
          height: 60vh;
        }

        form {
          display: grid;
        }

        paper-dialog {
          width: 100%;
          height: 100%;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Nueva actualización</h2>
        <paper-dialog-scrollable>
        <iron-form>
          <form>
            <paper-textarea name="content" label="Contenido *" required></paper-textarea>
            <vaadin-upload no-auto></vaadin-upload>
          </form>
        </iron-form>
        </paper-dialog-scrollable>
        <div class="buttons">
          <vaadin-button @click="${()=>{this.opened=!1}}">Cancelar</vaadin-button>
          <vaadin-button @click="${()=>this.createProjectUpdate()}">${createButtonText(loading)}</vaadin-button>
        </div>
      </paper-dialog>
    `}static get properties(){return{opened:{type:Boolean},projectId:{type:String}}}constructor(){super();this.opened=!1;this.client=Apollo.client;this.mutation=createMutation$1;this.refetchQueries=["projectDetail"];this.onCompleted=data=>{const{ok}=data.createProjectUpdate;if(ok){this.opened=!1;this.shadowRoot.querySelector("iron-form").reset();this.shadowRoot.querySelector("vaadin-upload").files=[]}}}_mutationData({content,projectId,files}={}){return{input:{files,content,project:projectId}}}createProjectUpdate(){const form=this.shadowRoot.querySelector("iron-form"),upload=this.shadowRoot.querySelector("vaadin-upload");if(form.validate()){this.variables=this._mutationData({files:[...upload.files],...form.serializeForm(),projectId:this.projectId});this.mutate()}}}window.customElements.define("new-project-update",NewProjectUpdate);const createMutation$2=Apollo.gql`
  mutation createProjectComment($input: ProjectCommentCreateGenericType!) {
    createProjectComment(input: $input) {
      ok
      errors { field, messages }
    }
  }
`,commentButtonText$1=loading=>html$1`${loading?html$1`<concrete-loading-icon></concrete-loading-icon>`:"Comentar"}`;class NewProjectComment extends ApolloMutation{render(){const{loading}=this;return html$1`
      <style>
        form {
          display: grid;
        }
      </style>
      <paper-textarea required></paper-textarea>
      <vaadin-button @click="${()=>this.comment()}">${commentButtonText$1(loading)}</vaadin-button>
    `}static get properties(){return{projectId:{type:String}}}constructor(){super();this.client=Apollo.client;this.mutation=createMutation$2;this.refetchQueries=["projectComments"];this.onCompleted=data=>{const{ok}=data.createProjectComment;if(ok){this.shadowRoot.querySelector("paper-textarea").value=""}}}_mutationData({project,content}={}){return{input:{project,content}}}comment(){const textarea=this.shadowRoot.querySelector("paper-textarea");if(textarea.validate()){this.variables=this._mutationData({project:this.projectId,content:textarea.value});this.mutate()}}}window.customElements.define("new-project-comment",NewProjectComment);const commentsQuery$1=Apollo.gql`
  query projectComments($project: ID!) {
    projectComments(project: $project) {
      results {
        id
        content
        createdAt
        createdBy { id, fullName }
      }
    }
  }
`;class ProjectComments extends ApolloQuery{render(){const{data,opened,_projectId}=this,comments=data&&data.projectComments?data.projectComments:{results:[]};return html$1`
      <style>
        :host {
          display: block;
        }

        paper-dialog {
          width: 100%;
          height: 100%;
        }

        comment-list {
          height: 60vh;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Comentarios</h2>
        <paper-dialog-scrollable>
          <new-project-comment .projectId="${_projectId}"></new-project-comment>
          <comment-list .comments="${comments.results}"></comment-list>
        </paper-dialog-scrollable>
        <div class="buttons">
          <vaadin-button @click="${()=>{this.opened=!1}}">Cerrar</vaadin-button>
        </div>
      </paper-dialog>
    `}static get properties(){return{opened:{type:Boolean},_projectId:{type:String}}}constructor(){super();this.opened=!1;this.client=Apollo.client;this.query=commentsQuery$1}shouldUpdate(changedProperties){return changedProperties.has("opened")&&!!this.data||changedProperties.has("_projectId")&&!!this.data||super.shouldUpdate(changedProperties)}set projectId(id){this._projectId=id;this.variables={project:id}}}window.customElements.define("project-comments",ProjectComments);const editMutation=Apollo.gql`
  mutation updateProject($input: ProjectUpdateGenericType!) {
    updateProject(input: $input) {
      ok
      errors { field, messages }
      project {
        id
        name
        theme
        state
        stateLabel
        description
        vinculatedInstitutions
        areas { id, name }
      }
    }
  }
`,editButtonText=loading=>html$1`${loading?html$1`<concrete-loading-icon></concrete-loading-icon>`:"Editar"}`;class EditProjectForm extends ApolloMutation{render(){const{loading,project}=this,{areas=[]}=project;return html$1`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
          <form>
          <vaadin-text-field name="name" label="Nombre" required .value="${project.name}"></vaadin-text-field>
          <vaadin-text-field name="theme" label="Tema" required .value="${project.theme}"></vaadin-text-field>
          <project-states-combo name="state" required .value="${project.state}"></project-states-combo>
          <vaadin-text-field name="vinculatedInstitutions" label="Instituciones vinculadas" .value="${project.vinculatedInstitutions}"></vaadin-text-field>
          <areas-checkbox name="areas" .value="${areas.map(a=>a.id)}"></areas-checkbox>
          <vaadin-text-area name="description" label="Descripción" .value="${project.description}"></vaadin-text-area>
          <div>
            <vaadin-button @click="${()=>this._fireEndEditingEvent()}">Cancelar</vaadin-button>
            <vaadin-button @click="${()=>this.editProject()}">${editButtonText(loading)}</vaadin-button>
          </div>
        </form>
      </iron-form>
    `}static get properties(){return{project:{type:Object}}}constructor(){super();this.client=Apollo.client;this.mutation=editMutation;this.onCompleted=data=>{const{ok}=data.updateProject;if(ok){this._fireEndEditingEvent()}}}_mutationData({id,state,name,theme,areas,vinculatedInstitutions,description}={}){return{input:{id,name,theme,state,areas,description,vinculatedInstitutions}}}_fireEndEditingEvent(){this.dispatchEvent(new CustomEvent("end-editing"))}editProject(){const form=this.shadowRoot.querySelector("iron-form"),areasCheckbox=form.querySelector("areas-checkbox");if(form.validate()){this.variables=this._mutationData({...form.serializeForm(),id:this.project.id,areas:areasCheckbox.value});this.mutate()}}}window.customElements.define("edit-project-form",EditProjectForm);const projectQuery=Apollo.gql`
  query projectDetail($id: ID!) {
    project(id: $id) {
      id
      name
      theme
      state
      canEdit
      stateLabel
      description
      canAddUpdate
      vinculatedInstitutions
      areas { id, name }
      updates { id, content, createdAt, createdBy { id, fullName }, files { id, document { url, shortName } } }
      owner {
        id
        fullName
        profile {
          id
          detailUrl
          __typename
          ...on ResearchGroup { 
            name
          }
        }
      }
    }
  }
`,personalOwner=(owner,url)=>html$1`<span>Usuario: </span> <a href="${url}">${owner.fullName}</a>`,researchGroupOwner=(group,url)=>html$1`<span>Grupo de investigación: </span> <a href="${url}">${group.name}</a>`,ownerInfo=owner=>{const{profile={}}=owner,{detailUrl,__typename}=profile;return"ResearchGroup"===__typename?researchGroupOwner(profile,detailUrl):personalOwner(owner,detailUrl)},projectInfo=(project,changeEdit,openProjectComments)=>{const{areas=[],owner={}}=project;return html$1`
    <div class="basic-info">
      <paper-button ?hidden="${!project.canEdit}" @click="${()=>{changeEdit(!0)}}">${editIcon}</paper-button>
      <vaadin-button @click="${()=>{openProjectComments()}}">Ver comentarios</vaadin-button>
      <iron-image src="${project.image}" placeholder="/static/images/project-none.png" sizing="contain" preload fade></iron-image>
      <p class="basic">
        <span>Nombre: </span>${project.name} <br>
        <span>Tema: </span>${project.theme} <br>
        ${ownerInfo(owner)} <br>
        <span>Estado: </span>${project.stateLabel} <br>
        <span>Instituciones vinculadas: </span>${project.vinculatedInstitutions} <br>
      </p>
      <div class="extra">
        <h3>Áreas de enfoque</h3>
        <ul>${areas.map(area=>html$1`<li>${area.name}</li>`)}</ul>
        <h3>Descripción</h3>
        <p>${project.description}</p>
      </div>
    </div>
    <project-comments .projectId="${project.id}"></project-comments>
  `};class ProjectDetail extends ApolloQuery{render(){const{data,editing}=this,project=data&&data.project?data.project:{owner:{}},{updates=[]}=project;return html$1`
      ${SharedStyles}
      <style>
        :host {
          display: block;
        }

        .updates ul {

        }

        .updates li {
          margin-bottom: 10px;
          list-style-type: none;
        }
      </style>
      <section>
        <h2>Proyecto</h2>
        ${editing?html$1`<edit-project-form .project="${project}" @end-editing="${()=>this._changeEditing(!1)}"></edit-project-form>`:projectInfo(project,this._changeEditing.bind(this),this._openProjectComments.bind(this))}
      </section>
      <section class="updates">
        <h3>Actualizaciones</h3>
        <paper-button ?hidden="${!project.canAddUpdate}" @click="${()=>this.shadowRoot.querySelector("new-project-update").opened=!0}">${addIcon} nueva</paper-button>
        <ul>
          ${updates.map(update=>html$1`<li><project-update-info .projectUpdate="${update}" @open-comments="${e=>{this._openProjectUpdateComments(e)}}"></project-update-info></li>`)}
        </ul>
        <new-project-update .projectId="${project.id}"></new-project-update>
        <project-update-comments></project-update-comments>
      </section>
    `}static get properties(){return{editing:{type:Boolean}}}constructor(){super();this.editing=!1;this.client=Apollo.client;this.query=projectQuery}shouldUpdate(changedProperties){return changedProperties.has("editing")&&!!this.data||super.shouldUpdate(changedProperties)}set projectId(id){this.variables={id}}_changeEditing(value){this.editing=value}_openProjectComments(){this.shadowRoot.querySelector("project-comments").opened=!0}_openProjectUpdateComments(e){console.log("open pu comments");console.log(e);const updateCommentsElem=this.shadowRoot.querySelector("project-update-comments");updateCommentsElem.projectUpdateId=e.detail.projectUpdate;updateCommentsElem.opened=!0}}window.customElements.define("project-detail",ProjectDetail);class CosmodoxProject extends PageViewElement{render(){const{params}=this;return html$1`
      ${SharedStyles}
      <project-detail .projectId="${params.id}"></project-detail>
    `}static get properties(){return{params:{type:Object}}}}window.customElements.define("cosmodox-project",CosmodoxProject);export{ironCheckedElementBehavior as $ironCheckedElementBehavior,paperCheckedElementBehavior as $paperCheckedElementBehavior,paperInkyFocusBehavior as $paperInkyFocusBehavior,vaadinProgressBar as $vaadinProgressBar,vaadinProgressMixin as $vaadinProgressMixin,vaadinTextArea as $vaadinTextArea,vaadinUploadFile as $vaadinUploadFile,vaadinUpload as $vaadinUpload,IronCheckedElementBehaviorImpl,IronCheckedElementBehavior,PaperCheckedElementBehaviorImpl,PaperCheckedElementBehavior,PaperInkyFocusBehaviorImpl,PaperInkyFocusBehavior,ProgressBarElement,ProgressMixin,TextAreaElement,UploadFileElement,UploadElement};