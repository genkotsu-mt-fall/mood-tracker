import { ClickSeed } from '../../interactions/click/clickSeed';

export type DragSession = {
  startClientX: number;
  startWindowStart: number;
  isDragging: boolean;
  clickSeed?: ClickSeed;
};
