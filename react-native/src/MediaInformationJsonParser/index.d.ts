import {MediaInformation} from "../MediaInformation";

export class MediaInformationJsonParser {

  from(ffprobeJsonOutput: string): Promise<MediaInformation>;

  fromWithError(ffprobeJsonOutput: string): Promise<MediaInformation>;

}
