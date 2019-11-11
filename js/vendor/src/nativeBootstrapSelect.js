/*! ========================================================================
 * Bootstrap Select for Bootstrap-native.js v2.4.5
 * ========================================================================
 * Copyright 2019, Salvatore Di Salvo (disalvo-infographiste[dot]be)
 * ======================================================================== */
'use strict';
/**
 * Bootstrap Select for Bootstrap-native.js v1.0.0
 */
class bootstrapSelect {
    /**
     * Constructor
     * @param {Element} element
     * @param {Object} options
     */
    constructor(element, options) {
        this.version = '1.0.0';
        this.utils = {
            /**
             * Return true if child is a descendant of parent
             * @param {Element} parent
             * @param {Element} child
             * @returns {boolean}
             */
            isDescendant(parent, child) {
                var node = child.parentNode;
                while (node !== null) {
                    if (node === parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            },
            eventFire: function(el, etype, data) {
                if(typeof data !== "undefined") el.eventData = data;
                if (el.fireEvent) {
                    el.fireEvent('on' + etype);
                } else {
                    var evObj = document.createEvent('Events');
                    evObj.initEvent(etype, true, false);
                    el.dispatchEvent(evObj);
                }
            }
        };
        this.element = element;
        this.defaults = {
            select      : this,
            autoclose   : true,
            cancelbtn   : false,
            clearbtn    : false,
            livefilter  : false,
            filter      : null,
            fmethod     : 'recursive',
            open        : 'open',
            filled      : 'filled',
            display     : '.dropdown-toggle',
            list        : '.dropdown-menu',
            placeholder : '.placeholder',
            items       : '.items',
            current     : '.current',
            clear       : '.clear',
            selected    : '.selected',
            cancel      : '.cancel'
        };
        this.options = Object.assign({}, this.parseData(), options);
        this.structure = Object.assign({}, this.parts());
        this.init();
        this.element.bootstrapSelect = this;
    }

    /**
     * Parse structure data to override default settings
     * @returns Object
     */
    parseData() {
        return {
            select      : this.defaults.select,
            autoclose   : this.element.dataset.autoclose || this.defaults.autoclose,
            cancelbtn   : this.element.dataset.cancel || this.defaults.cancelbtn,
            clearbtn    : this.element.dataset.clear || this.defaults.clearbtn,
            livefilter  : this.element.dataset.live || this.defaults.livefilter,
            filter      : this.element.dataset.filter || this.defaults.filter,
            fmethod     : this.element.dataset.fmethod || this.defaults.fmethod,
            open        : this.element.dataset.open || this.defaults.open,
            filled      : this.element.dataset.filled || this.defaults.filled,
            display     : this.defaults.display,
            list        : this.defaults.list,
            placeholder : this.defaults.placeholder,
            items       : this.defaults.items,
            current     : this.defaults.current,
            clear       : this.defaults.clear,
            selected    : this.defaults.selected,
            cancel      : this.defaults.cancel
        }
    }

    /**
     * Return structure elements
     * @returns Object
     */
    parts() {
        return {
            $select      : this.element,
            $section     : this.element.dataset.section ? this.element.dataset.section : this.element.getAttribute('id'),
            $display     : this.element.querySelector(this.options.display),
            $list        : this.element.querySelector(this.options.list),
            $placeholder : this.element.querySelector(this.options.placeholder),
            $items       : this.element.querySelectorAll(this.options.items),
            $current     : this.element.querySelector(this.options.current),
            $clear       : this.element.querySelector(this.options.clear),
            $selected    : this.get(),
            $cancel      : this.element.querySelector(this.options.cancel)
        }
    }

    /**
     * Initialise events
     */
    init() {
        let BS = this;
        if ( this.structure.$selected !== null ) BS.select(this.structure.$selected);

        function clickDisplay(e) {
            e.preventDefault();
            BS.toggle();
        }
        this.structure.$display.removeEventListener('click', clickDisplay);
        this.structure.$display.addEventListener('click', clickDisplay);

        function clickItem() { BS.select(this); }
        this.structure.$items.forEach(function(i) {
            i.removeEventListener('click', clickItem);
            i.addEventListener('click', clickItem);
        });

        if ( this.options.cancelbtn ) {
            function clickCancel(e) {
                e.preventDefault();
                BS.toggle('close');
            }
            this.structure.$cancel.removeEventListener('click', clickCancel);
            this.structure.$cancel.addEventListener('click', clickCancel);
        }

        if ( this.options.clearbtn ) {
            function clickClear() { BS.clear(e); }
            this.structure.$clear.removeEventListener('click', clickClear);
            this.structure.$clear.addEventListener('click', clickClear);
        }

        if ( typeof filterList !== "undefined" && this.options.filter !== null) {
            let $toFilter = this.options.filter.split(' ');

            if (Array.isArray($toFilter) && $toFilter.length > 0 ) {
                for(var i=0;i < $toFilter.length;i++) {
                    let tf = document.getElementById($toFilter[i]);
                    new filterList(tf, { method: this.options.fmethod });
                }
            }
        }

        if (typeof liveFilter !== "undefined" && this.options.livefilter ) {
            this.element.querySelectorAll('.live-filtering').forEach(function(lf){
                new liveFilter(lf);
            });
        }

        document.addEventListener("mouseup", function(e) {
            if(!BS.utils.isDescendant(BS.element,e.target) && BS.element.classList.contains(BS.options.open)) {
                BS.toggle('close');
                e.preventDefault();
            }
        });

        let targetInput = document.querySelector('[name="' + BS.structure.$section + '_id"]');
        if(targetInput !== null && targetInput.value !== '') {
            let id = targetInput.value;
            let cus = BS.structure.$list.querySelector('li[data-value="'+id+'"]');
            if(cus === null) {
                BS.clear();
            } else {
                BS.select(cus);
            }
        }
    }

    /**
     * Open or close the select
     * @param {String} mode - open||close
     */
    toggle(mode) {
        let open = mode === 'close' || this.element.classList.contains(this.options.open);
        this.element.classList.toggle(this.options.open, !open);
        if ( open && this.options.livefilter && typeof liveFilter !== "undefined" ) this.structure.$select.querySelector('.live-filtering').liveFilter.clear();
    }

    /**
     * Get the selected element
     * @returns {Element | null}
     */
    get() {
        return this.element.querySelector(this.options.selected);
    }

    /**
     * Select a element in the item list
     * @param {Element} item
     */
    select(item) {
        let BS = this;
        if(BS.structure.$current !== null) BS.structure.$current.classList.toggle('active');

        BS.structure.$selected = BS.get();
        if(BS.structure.$selected !== null) BS.structure.$selected.classList.remove('selected');

        item.classList.add('selected');

        BS.updateDisplay('select',item);

        if( typeof filterList !== "undefined" ) {
            if ( BS.options.filter !== null) {
                let $toFilter = BS.options.filter.split(' ');

                if (Array.isArray($toFilter) && $toFilter.length > 0 ) {
                    for(var i=0;i < $toFilter.length;i++) {
                        let tf = document.getElementById($toFilter[i]);
                        tf.filterList.filter(BS.structure.$section,item.dataset.value);
                    }
                }
            }
        }

        if (this.options.autoclose === true) this.toggle('close');
    }

    /**
     * Unselect selected items and clear the search input if there is any
     * @param {Event} e
     */
    clear(e) {
        let BS = this;
        if ( e !== undefined ) e.preventDefault();

        BS.structure.$selected = BS.get();

        if ( BS.structure.$selected !== null && BS.structure.$selected.innerHTML !== undefined ) {
            BS.structure.$selected.classList.remove('selected');

            BS.updateDisplay('clear');

            if( typeof liveFilter !== "undefined" ) {
                if ( BS.options.filter !== null) {
                    let $toFilter = BS.options.filter.split(' ');

                    if (Array.isArray($toFilter) && $toFilter.length > 0 ) {
                        for(var i=0;i < $toFilter.length;i++) {
                            let tf = document.getElementById($toFilter[i]);
                            tf.listFilter.filter(BS.structure.$section);
                        }
                    }
                }
            }
        }

        if (BS.options.autoclose === true) BS.toggle('close');
    }

    /**
     * Refresh the display
     */
    refresh() {
        if (this.structure.$selected.dataset.value !== undefined) this.updateDisplay('select');
    }

    /**
     * Reset structure
     */
    reset() {
        this.structure = Object.assign({}, this.parts());
        this.init();
    }

    /**
     * Remove all available items
     */
    empty() {
        this.structure.$items.firstChild.parentNode.innerHTML = '';
    }

    /**
     * Update the display after either select or clear
     * @param {String} mode
     * @param {Element} selected
     */
    updateDisplay(mode, selected) {
        let BS = this;
        let input = document.querySelector('[name="' + BS.structure.$section + '"]');
        let inputID = document.querySelector('[name="' + BS.structure.$section + '_id"]');
        if(selected === null) return;

        if( mode === 'select' ) {
            if(BS.structure.$clear !== null) BS.structure.$clear.classList.remove('hide','hidden');
            BS.structure.$display.innerHTML = '<span class="text">' + selected.innerHTML + '</span><span class="caret"></span>';
        }

        if( mode === 'clear' ) {
            if(BS.structure.$clear !== null) BS.structure.$clear.classList.add('hide','hidden');
            BS.structure.$display.innerHTML = '<span class="placeholder">' + BS.structure.$placeholder.innerHTML + '</span><span class="caret"></span>';
        }

        if( mode === 'clear' || mode === 'select' ) {
            let value = mode === 'clear' ? '' : selected.dataset.value;
            let id = mode === 'clear' ? '' : (selected.dataset.id === undefined ? value : selected.dataset.id);

            BS.updateInput(input, value, mode);
            BS.updateInput(inputID, id, mode);
            BS.structure.$display.classList.toggle(BS.options.filled,mode === 'select');
        }

        BS.utils.eventFire(inputID,'bootstrapselect');
    }

    /**
     * Update input or select
     * @param {HTMLInputElement|HTMLSelectElement} elem
     * @param {String} value
     * @param {String} mode
     */
    updateInput(elem, value, mode) {
        let BS = this;

        if( mode === 'clear' || mode === 'select' ) {
            if(elem !== null) {
                if(elem.tagName === 'INPUT') elem.value = mode === 'clear' ? '' : value;
                if(elem.tagName === 'SELECT') {
                    let opts = elem.options;
                    for(var i = 0; i < opts.length; i++) {
                        opts[i].selected = false;
                    }
                    if(mode === 'select' && value !== '' && value !== undefined) elem.querySelector('[value="' + value + '"]').selected = true;
                }

                BS.utils.eventFire(elem,'change');
            }

            BS.structure.$display.classList.toggle(BS.options.filled,mode === 'select');
        }
    }
}

window.addEventListener('load',function(){
    document.querySelectorAll('.selectpicker').forEach(function(sp) {
        new bootstrapSelect(sp);
    });
});