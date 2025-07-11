export namespace main {
	
	export class TableData {
	    tableRows: any[];
	    errMsg: string;
	
	    static createFrom(source: any = {}) {
	        return new TableData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableRows = source["tableRows"];
	        this.errMsg = source["errMsg"];
	    }
	}

}

