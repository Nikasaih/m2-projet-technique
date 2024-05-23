"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatusType = void 0;
var GameStatusType;
(function (GameStatusType) {
    GameStatusType[GameStatusType["CANCELED"] = 0] = "CANCELED";
    GameStatusType[GameStatusType["PENDING"] = 1] = "PENDING";
    GameStatusType[GameStatusType["PLAYING_CHARGE"] = 2] = "PLAYING_CHARGE";
    GameStatusType[GameStatusType["PLAYING_DECHARGE"] = 3] = "PLAYING_DECHARGE";
    GameStatusType[GameStatusType["FINISHED"] = 4] = "FINISHED";
})(GameStatusType || (exports.GameStatusType = GameStatusType = {}));
