import { PhoenixLoader } from './phoenix-loader';

export class LHCbLoader extends PhoenixLoader {
  private data: any;

  constructor() {
    super();
    this.data = {};
  }

  public process(data: any) {
    console.log('Processing event data');
    this.data = data;
  }

  public getEventData(): any {

    const eventData = {
      eventNumber: this.data.eventNumber,
      runNumber: this.data.runNumber,
      Hits: undefined,
      Tracks: undefined
    };

    let part_list = [];
    const pdata_list = this.data.PARTICLES;
    if (pdata_list) {
      for (let j = 0; j < pdata_list.length; j++) {
        let pdata = pdata_list[j];
        let mom = Math.pow(pdata.px, 2) + Math.pow(pdata.py, 2) + Math.pow(pdata.pz, 2);
        let part = {
          particle_id: pdata.name,
          pos: pdata.track,
          mom
        };
        part_list.push(part);
      }
    }
    eventData.Tracks = { Particles: part_list };
    return eventData;
  }

  /**
   * Get LHCb specific metadata associated to the event (experiment info, time, run, event...).
   * @returns Metadata of the event.
   */
  getEventMetadata(): string[] {
    let metadata = super.getEventMetadata();
    if (this.data['time']) {
      metadata.push('Data recorded: ' + this.data['time']);
    }
    return metadata;
  }
}
