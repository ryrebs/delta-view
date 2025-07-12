export namespace main {
	
	export class TableInfo {
	    name: string;
	    tblPath: string;
	    rows: any[];
	    numRows: number;
	    currOffset: number;
	    errMsg: string;
	
	    static createFrom(source: any = {}) {
	        return new TableInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.tblPath = source["tblPath"];
	        this.rows = source["rows"];
	        this.numRows = source["numRows"];
	        this.currOffset = source["currOffset"];
	        this.errMsg = source["errMsg"];
	    }
	}

}

