// Browser copy of Kumo's ChartPalette (ECharts canvas cannot read CSS variables).
// Values verbatim from github.com/cloudflare/kumo tag @cloudflare/kumo@2.14.0,
// packages/kumo/src/components/chart/Color.ts. In a React build, import
// { ChartPalette } from "@cloudflare/kumo" instead of this file.
window.ChartPalette = (() => {
  const categorical = {
    light: ['#4290F0', '#F5B647', '#E8649D', '#8D58EE', '#50C3B6', '#D37536'],
    dark: ['#4290F0', '#EEB720', '#E8649D', '#8D58EE', '#50C3B6', '#D37536'],
  };
  const semantic = {
    light: { Attention: '#FC574A', Warning: '#F8A054', Success: '#00A63E', Neutral: '#B9D6FF', Disabled: '#CBCBCB', Skeleton: '#DDDDDD' },
    dark: { Attention: '#FC574A', Warning: '#F8A054', Success: '#00A63E', Neutral: '#8EC5FF', Disabled: '#878787', Skeleton: '#5C5C5C' },
  };
  const sequential = {
    light: { blues: ['#E1EAF4', '#8EBCF6', '#4290F0', '#0E58B4', '#03254F'] },
    dark: { blues: ['#03254F', '#0E58B4', '#4290F0', '#A6BFDD', '#E1EAF4'] },
  };
  const text = {
    light: { primary: '#6B7280', secondary: '#9CA3AF' },
    dark: { primary: '#9CA3AF', secondary: '#6B7280' },
  };
  const m = (dark) => (dark ? 'dark' : 'light');
  return {
    categorical: (i, dark = false) => categorical[m(dark)][i % 6],
    semantic: (name, dark = false) => semantic[m(dark)][name],
    sequential: (name, dark = false) => [...sequential[m(dark)][name]],
    text: (variant, dark = false) => text[m(dark)][variant],
  };
})();
