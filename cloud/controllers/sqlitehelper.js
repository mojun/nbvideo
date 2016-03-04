var sqlite3 = require('sqlite3').verbose();
var db = null;
var util = require('util');
var fs = require('fs');

exports.connect = function(dbname, callback){
	db = new sqlite3.Database('ymmbd.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(err){
		if(err) {
			util.log('FAIL on creating database ' + dbname);
			callback(err);
		} else {
			callback(null);
		}
	});

};

exports.disconnect = function(cb){
	if(db) {
		db.close();
	}
	cb(null);
}

exports.setup = function(cb) {
	db.run("CREATE TABLE IF NOT EXISTS fushi " + "(aid INTEGER PRIMARY KEY AUTOINCREMENT, iid NUMERIC, title TEXT, html TEXT, surl TEXT, pubtime TEXT, type NUMERIC, pageCount NUMERIC)", function(err){
		if(err) {
			util.log('FAIL on creating table ' + err);
            cb(err);
        } else {
        	cb(null);
        }
	});
}

exports.add = function(iid, title, html, surl, pubtime, type, pageCount, callback) {
	db.run("INSERT INTO fushi ( iid,title, html, surl, pubtime, type, pageCount) " + "VALUES (?, ?, ?, ?, ?, ?, ?)",iid ,title, html, surl, pubtime, type, pageCount,function(error){
		if (error){
            util.log('FAIL on add ' + error);
            callback(error);
        } else {
            callback(null);
        }
	});
}

exports.count = function(cb) {
	db.get("SELECT count(*) FROM fushi",function(err, n){
		cb(err, n["count(*)"]);
	});
}

exports.rename = function(cb) {
	for(var i=601; i<894; i++) {
		var aid = i;
		var htmlpath = "3s01/" + (i-1) + ".html";
		db.run("UPDATE fushi SET type = ? WHERE aid = ?", 2, aid, function(err){
			if(err) {
				console.log("失败");
			} else {
				console.log("成功");
			}
		});

	}
	
}

exports.download = function(cb) {
	var results = [];
	db.all("SELECT * FROM fushi", function(err, rows){
		for(var i=0;i<rows.length; i++) {
			var o = {};
			var row = rows[i];
			o.aid = row.aid;
			o.title = row.title;
			o.htmlpath = row.htmlpath;
			o.surl = row.surl;
			o.type = row.type;
			console.log(row.aid);
			results.push(o);
		}
		var oo = {};
		oo.results = results;
		var text = JSON.stringify(oo);
		var saveFilePath = "public/ymmbd.json";
		fs.writeFile(saveFilePath, text,function(err){
			if(err){
				console.log("save json failed");
			} else {
				console.log("save json success");
			}
		});
		console.log("end--------------");
	});
	
}

// SELECT  *   FROM trom_data WHERE device_id=12  ORDER BY time_stamp DESC LIMIT  1   OFFSET 0

// sql语句，其中LIMIT 1 OFFSET 0的意思是说在查询结果中以第0条记录为基准（包括第0条），取1条记录，这样所取得的记录即为第0条记录，也即此表中device_id=12  且time_stamp为最大的时间。

 

// LIMIT  所要取的记录数目（以基准点为参考点） OFFSET  基准点

 

// SELECT  *   FROM trom_data  LIMIT  nNumRecord   OFFSET nBaseRow

// 表示从第nBaseRow行(基于0的索引)(包括该行)开始,取其后的nNumRecord  条记录