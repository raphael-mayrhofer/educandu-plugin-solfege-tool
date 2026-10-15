import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import ABCJS from 'abcjs';
import { useTranslation } from 'react-i18next';
import { sectionDisplayProps } from '@educandu/educandu/ui/default-prop-types.js';

const toAbcAccidentals = melody => melody
  .replace(/([A-Ga-g])##/g, '^^$1')
  .replace(/([A-Ga-g])bb/g, '__$1')
  .replace(/([A-Ga-g])#/g, '^$1')
  .replace(/([A-Ga-g])b/g, '_$1')
  .replace(/([A-Ga-g])n/g, '=$1');

const createAbc = (line, content) => [
  'X:1',
  `M:${content.meterNumerator}/${content.meterDenominator}`,
  `L:1/${content.meterDenominator}`,
  '%%stretchlast true',
  `K:${content.rootNote}${content.keyQuality === 'minor' ? 'm' : ''}`,
  toAbcAccidentals(line)
].join('\n');

export default function SolfegeToolDisplay({ content }) {
  const { t } = useTranslation('raphael-mayrhofer/educandu-plugin-solfege-tool');
  const notationRef = useRef(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    const render = () => {
      try {
        if (!notationRef.current) {
          return;
        }

        notationRef.current.replaceChildren();
        const lines = content.melody.split(/\r?\n/).filter(line => line.trim());

        lines.forEach(line => {
          const system = document.createElement('div');
          system.className = 'EP_RaphaelMayrhofer_SolfegeTool_Display-system';
          notationRef.current.appendChild(system);
          ABCJS.renderAbc(system, createAbc(line, content), {
            responsive: 'resize',
            // ABCJS uses this snake_case option name in its public API.
            // eslint-disable-next-line camelcase
            add_classes: true,
            paddingtop: 12,
            paddingbottom: 20,
            staffwidth: Math.max(240, notationRef.current.clientWidth - 24),
            wrap: { minSpacing: 2.5, preferredMeasuresPerLine: 4 }
          });
        });
        setError('');
      } catch (renderError) {
        setError(renderError.message || t('renderError'));
      }
    };

    render();
    const observer = new ResizeObserver(render);
    if (notationRef.current) {
      observer.observe(notationRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [content, t]);

  const handlePlayback = async () => {
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
      setIsPlaying(false);
      return;
    }

    try {
      const visualObjects = ABCJS.renderAbc('*', createAbc(content.melody.replace(/\r?\n/g, ' '), content));
      const synth = new ABCJS.synth.CreateSynth();
      await synth.init({ visualObj: visualObjects[0] });
      await synth.prime();
      // eslint-disable-next-line require-atomic-updates
      synthRef.current = synth;
      setIsPlaying(true);
      await synth.start({ qpm: content.tempo });
      // eslint-disable-next-line require-atomic-updates
      synthRef.current = null;
      setIsPlaying(false);
    } catch (playbackError) {
      // eslint-disable-next-line require-atomic-updates
      synthRef.current = null;
      setIsPlaying(false);
      setError(playbackError.message || t('playbackError'));
    }
  };

  return (
    <div className="EP_RaphaelMayrhofer_SolfegeTool_Display">
      <div className={`u-horizontally-centered u-width-${content.width}`}>
        <div className="EP_RaphaelMayrhofer_SolfegeTool_Display-header">
          <h3>{t('name')}</h3>
          <span>v0.1.0</span>
        </div>
        <p className="EP_RaphaelMayrhofer_SolfegeTool_Display-summary">
          {t(`displayModes.${content.displayMode}`)} · {content.rootNote} {t(content.keyQuality)} · {content.meterNumerator}/{content.meterDenominator}
        </p>
        <Button onClick={handlePlayback}>{isPlaying ? t('stop') : t('play')}</Button>
        {!!error && <p className="EP_RaphaelMayrhofer_SolfegeTool_Display-error" role="alert">{error}</p>}
        <div ref={notationRef} className="EP_RaphaelMayrhofer_SolfegeTool_Display-notation" />
      </div>
    </div>
  );
}

SolfegeToolDisplay.propTypes = {
  ...sectionDisplayProps
};
