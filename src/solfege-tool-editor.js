import React from 'react';
import { Form, Input, InputNumber, Select, Slider } from 'antd';
import { useTranslation } from 'react-i18next';
import Info from '@educandu/educandu/components/info.js';
import { FORM_ITEM_LAYOUT } from '@educandu/educandu/domain/constants.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';

const DISPLAY_MODES = ['hands', 'labels', 'numbers', 'boomwhackers', 'tone-names', 'tone-names-plain'];
const ROOT_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

export default function SolfegeToolEditor({ content, onContentChanged }) {
  const { t } = useTranslation('raphael-mayrhofer/educandu-plugin-solfege-tool');
  const updateContent = values => onContentChanged({ ...content, ...values });

  return (
    <div className="EP_RaphaelMayrhofer_SolfegeTool_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('melody')} {...FORM_ITEM_LAYOUT}>
          <Input.TextArea
            value={content.melody}
            rows={5}
            spellCheck={false}
            onChange={event => updateContent({ melody: event.target.value })}
            />
        </Form.Item>
        <Form.Item label={t('meter')} {...FORM_ITEM_LAYOUT}>
          <InputNumber
            min={1}
            max={32}
            value={content.meterNumerator}
            aria-label={t('meterNumerator')}
            onChange={value => updateContent({ meterNumerator: value || 4 })}
            />
          <span className="EP_RaphaelMayrhofer_SolfegeTool_Editor-meterSeparator">/</span>
          <Select
            value={content.meterDenominator}
            aria-label={t('meterDenominator')}
            options={[1, 2, 4, 8, 16].map(value => ({ value, label: value }))}
            onChange={value => updateContent({ meterDenominator: value })}
            />
        </Form.Item>
        <Form.Item label={t('key')} {...FORM_ITEM_LAYOUT}>
          <Select
            value={content.rootNote}
            options={ROOT_NOTES.map(value => ({ value, label: value }))}
            onChange={value => updateContent({ rootNote: value })}
            />
          <Select
            className="EP_RaphaelMayrhofer_SolfegeTool_Editor-quality"
            value={content.keyQuality}
            options={['major', 'minor'].map(value => ({ value, label: t(value) }))}
            onChange={value => updateContent({ keyQuality: value })}
            />
        </Form.Item>
        <Form.Item label={t('displayMode')} {...FORM_ITEM_LAYOUT}>
          <Select
            value={content.displayMode}
            options={DISPLAY_MODES.map(value => ({ value, label: t(`displayModes.${value}`) }))}
            onChange={value => updateContent({ displayMode: value })}
            />
        </Form.Item>
        <Form.Item label={t('tempo')} {...FORM_ITEM_LAYOUT}>
          <Slider min={40} max={200} value={content.tempo} onChange={tempo => updateContent({ tempo })} />
        </Form.Item>
        <Form.Item
          label={<Info tooltip={t('common:widthInfo')}>{t('common:width')}</Info>}
          {...FORM_ITEM_LAYOUT}
          >
          <ObjectWidthSlider value={content.width} onChange={width => updateContent({ width })} />
        </Form.Item>
      </Form>
    </div>
  );
}

SolfegeToolEditor.propTypes = {
  ...sectionEditorProps
};
