import { Board } from "./board";

export class BoardListResponse {
    ownedBoards: Board[];
    sharedBoards: Board[];
    organisationBoards: Board[];
}