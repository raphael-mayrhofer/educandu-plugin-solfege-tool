import { describe, expect, it } from 'vitest';
import SolfegeToolInfo from './solfege-tool-info.js';

describe('SolfegeToolInfo', () => {
  const sut = new SolfegeToolInfo();

  it('provides valid default content', () => {
    const content = sut.getDefaultContent();

    expect(() => sut.validateContent(content)).not.toThrow();
    expect(content.displayMode).toBe('hands');
    expect(content.meterDenominator).toBe(4);
  });

  it('rejects unsupported display modes', () => {
    const content = { ...sut.getDefaultContent(), displayMode: 'unknown' };

    expect(() => sut.validateContent(content)).toThrow();
  });

  it('clones content independently', () => {
    const content = sut.getDefaultContent();
    const clone = sut.cloneContent(content);

    clone.melody = 'C';
    expect(content.melody).not.toBe(clone.melody);
  });
});
