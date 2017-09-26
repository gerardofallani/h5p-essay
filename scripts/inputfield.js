(function (Essay) {
  'use strict';

  // CSS Classes:
  var MAIN_CONTAINER = 'h5p-essay-input-field';
  var INPUT_LABEL = 'h5p-essay-input-field-label';
  var INPUT_FIELD = 'h5p-essay-input-field-textfield';
  var WRAPPER_MESSAGE = 'h5p-essay-input-field-message-wrapper';
  var CHAR_MESSAGE = 'h5p-essay-input-field-message-char';
  var SAVE_MESSAGE = 'h5p-essay-input-field-message-save';

  Essay.InputField = function (params, previousState) {
    var that = this;
    this.params = params;
    this.previousState = previousState;

    // Sanitization
    this.params.taskDescription = this.params.taskDescription || '';
    this.params.placeholderText = this.params.placeholderText || '';

    // Task description
    this.taskDescription = document.createElement('div');
    this.taskDescription.classList.add(INPUT_LABEL);
    this.taskDescription.innerHTML = this.params.taskDescription;

    // InputField
    this.inputField = document.createElement('textarea');
    this.inputField.classList.add(INPUT_FIELD);
    this.inputField.setAttribute('rows', this.params.inputFieldSize);
    this.inputField.setAttribute('maxlength', this.params.maximumLength);
    this.inputField.setAttribute('placeholder', this.params.placeholderText);
    this.inputField.setAttribute('tabindex', 0);
    this.setText(previousState);

    this.content = document.createElement('div');
    this.content.appendChild(this.inputField);

    // Container
    this.container = document.createElement('div');
    this.container.classList.add(MAIN_CONTAINER);
    this.container.appendChild(this.taskDescription);
    this.container.appendChild(this.content);

    if (typeof this.params.maximumLength !== 'undefined') {
      var statusWrapper = document.createElement('div');
      statusWrapper.classList.add(WRAPPER_MESSAGE);

      this.statusChars = document.createElement('div');
      this.statusChars.classList.add(CHAR_MESSAGE);
      statusWrapper.append(this.statusChars);

      ['change', 'keyup', 'paste'].forEach(function (event) {
        that.inputField.addEventListener(event, function () {
          that.updateMessageSaved('');
          that.updateMessageChars();
        });
      });

      this.statusSaved = document.createElement('div');
      this.statusSaved.classList.add(SAVE_MESSAGE);
      statusWrapper.append(this.statusSaved);

      this.content.append(statusWrapper);
      this.updateMessageChars();
    }
    else {
      this.statusSaved = document.createElement('div');
      this.statusSaved.classList.add(SAVE_MESSAGE);
      this.content.append(this.statusSaved);
    }
  };

  /**
   * Get introduction for H5P.Question.
   * @return {object} DOM elements for introduction.
   */
  Essay.InputField.prototype.getIntroduction = function () {
    return this.taskDescription;
  };

  /**
   * Get content for H5P.Question.
   * @return {object} DOM elements for content.
   */
  Essay.InputField.prototype.getContent = function () {
    return this.content;
  };

  /**
   * Get current text in InputField.
   * @return {string} Current text.
   */
  Essay.InputField.prototype.getText = function () {
    return this.inputField.value;
  };

  /**
   * Set the text for the InputField.
   * @param {string|object} previousState Previous state that was saved.
   */
  Essay.InputField.prototype.setText = function (previousState) {
    if (previousState === undefined) {
      return;
    }
    if (typeof previousState === 'string') {
      this.inputField.innerHTML = previousState;
    }
    if (typeof previousState === 'object' && !Array.isArray(previousState)) {
      this.inputField.innerHTML = previousState.inputField || '';
    }
  };

  /**
   * Compute the remaining number of characters
   * @returns {number} Returns number of characters left
   */
  Essay.InputField.prototype.computeRemainingChars = function () {
    return this.params.maximumLength - this.inputField.value.length;
  };

  /**
   * Update character message field
   */
  Essay.InputField.prototype.updateMessageChars = function () {
    this.statusChars.innerHTML = this.params.remainingChars
        .replace(/@chars/g, this.computeRemainingChars());
  };

  /**
   * Update the indicator message for saved text
   * @param {string} saved - Message to indicate the text was saved
   */
  Essay.InputField.prototype.updateMessageSaved = function (saved) {
    // Add/remove blending effect
    if (saved === undefined || saved === '') {
      this.statusSaved.classList.remove('h5p-essay-input-field-message-save-animation');
    }
    else {
      this.statusSaved.classList.add('h5p-essay-input-field-message-save-animation');
    }
    this.statusSaved.innerHTML = saved;
  };

})(H5P.Essay);
