import React from "react";

// Information needed to build the tooltip
export type InteractionData = {
    xPos: number;
    yPos: number;
    name: string;
};

type TooltipProps = {
    interactionData: InteractionData | null;
};

