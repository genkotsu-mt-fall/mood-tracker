import { ComposedChart } from 'recharts';

// Recharts の onMouseDown 型をそのまま使う（型ズレ対策）
export type ComposedChartMouseDown = NonNullable<
  React.ComponentProps<typeof ComposedChart>['onMouseDown']
>;
export type MouseDownState = Parameters<ComposedChartMouseDown>[0];
export type MouseDownEvent = Parameters<ComposedChartMouseDown>[1];
