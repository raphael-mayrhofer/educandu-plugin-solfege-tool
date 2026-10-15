import joi from 'joi';
import React from 'react';
import { SoundOutlined } from '@ant-design/icons';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { PLUGIN_GROUP } from '@educandu/educandu/domain/constants.js';

class SolfegeToolInfo {
  static typeName = 'raphael-mayrhofer/educandu-plugin-solfege-tool';

  allowsInput = true;

  getDisplayName(t) {
    return t('raphael-mayrhofer/educandu-plugin-solfege-tool:name');
  }

  getIcon() {
    return <SoundOutlined />;
  }

  getGroups() {
    return [PLUGIN_GROUP.mostUsed, PLUGIN_GROUP.other];
  }

  async resolveDisplayComponent() {
    return (await import('./solfege-tool-display.js')).default;
  }

  async resolveEditorComponent() {
    return (await import('./solfege-tool-editor.js')).default;
  }

  getDefaultContent() {
    return {
      melody: 'C D E F G2 G2 A A A A G4 A A A A G4\nF F F F E2 E2 D D D D C4',
      width: 100,
      meterNumerator: 4,
      meterDenominator: 4,
      rootNote: 'C',
      keyQuality: 'major',
      displayMode: 'hands',
      tempo: 100
    };
  }

  validateContent(content) {
    const schema = joi.object({
      melody: joi.string().allow('').required(),
      width: joi.number().min(10).max(100).required(),
      meterNumerator: joi.number().integer().min(1).max(32).required(),
      meterDenominator: joi.number().valid(1, 2, 4, 8, 16).required(),
      rootNote: joi.string().required(),
      keyQuality: joi.string().valid('major', 'minor').required(),
      displayMode: joi.string().valid('hands', 'labels', 'numbers', 'boomwhackers', 'tone-names', 'tone-names-plain').required(),
      tempo: joi.number().integer().min(40).max(200).required()
    });

    joi.attempt(content, schema, { abortEarly: false, convert: false, noDefaults: true });
  }

  cloneContent(content) {
    return cloneDeep(content);
  }

}

export default SolfegeToolInfo;
