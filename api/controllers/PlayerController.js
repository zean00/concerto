/**
 * PlayerController
 *
 * @description :: Server-side logic for managing Players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `PlayerController.start()`
   */
  start: function (req, res) {
		var time = (new Date()).getTime() + 3000;
		var data = {cmd:'start',time:time};
		//console.log(data);
		sails.sockets.blast(data);
		sails.concerto.playTime = time;
		sails.concerto.state = 'play';
		for(var i=0;i<sails.concerto.noIns;i++){
			sails.concerto.ins[i+1] = 'unmute';
		}
    return res.json(data);
  },


  /**
   * `PlayerController.stop()`
   */
  stop: function (req, res) {
		sails.sockets.blast({cmd:'stop'});
		sails.concerto.state = 'stop';
		sails.concerto.playTime = 0;
		sails.concerto.ins = {};
    return res.json({cmd:'stop'});
  },


  /**
   * `PlayerController.pause()`
   */
  pause: function (req, res) {

		sails.concerto.state = 'pause';
		var time = (new Date()).getTime() + 3000;

		var pos = sails.concerto.playTime - time;
		sails.concerto.pauseTime = pos;
		//sails.concerto.playTime = 0;
		sails.sockets.blast({cmd:'pause',time:time});
	  return res.json({
	      cmd:'pause'
	   });
  },


  /**
   * `PlayerController.resume()`
   */
  resume: function (req, res) {
		var time = (new Date()).getTime() + 3000;
		var data = {cmd:'resume',time:time,pos:sails.concerto.pauseTime};
		sails.sockets.blast(data);
    return res.json(data);
  },

	init: function(req,res){
		//var client = sails.sockets.id(req.socket);
		var client = req.ip;
		console.log(client);
		var data = {};
		if(sails.concerto.clientlist[client]!=undefined)
			data.insNo = sails.concerto.clientlist[client];
		else{
			data.insNo = sails.concerto.counter;
			if(sails.concerto.counter==5)
				sails.concerto.counter = 1;
			else
				sails.concerto.counter++;

			sails.concerto.clientlist[client] = data.insNo;
			if(sails.concerto.insCounter[data.insNo]==undefined)
				sails.concerto.insCounter[data.insNo] = 0;
			sails.concerto.insCounter[data.insNo]++;
		}

		if(sails.concerto.state=='play'){
			data.action = 'play';
			data.playTime = sails.concerto.playTime;
			data.state = sails.concerto.ins[data.insNo];
		}else{
			data.action = 'standby';
		}
		return res.json(data);
	},

	mute: function(req,res){
		if(req.params.id==undefined){
			sails.sockets.blast({cmd:'mute'});
			for(var i=0;i<sails.concerto.noIns;i++){
				sails.concerto.ins[i+1] = 'mute';
			}
		}else{
			sails.sockets.blast({cmd:'mute',insNo:req.params.id});
			sails.concerto.ins[req.params.id] = 'mute';
		}
		//console.log(req.params.id);
		return res.json({

		});
	},

	unmute: function(req,res){
		if(req.params.id==undefined){
			sails.sockets.blast({cmd:'unmute'});
			for(var i=0;i<sails.concerto.noIns;i++){
				sails.concerto.ins[i+1] = 'unmute';
			}
		}else{
			sails.sockets.blast({cmd:'unmute',insNo:req.params.id});
			sails.concerto.ins[req.params.id] = 'unmute';
		}
		return res.json({

		});
	},

	solo:function(req,res){
		if(req.params.id!=undefined&&req.params.id<=sails.concerto.noIns){
				if(req.params.id==0)req.params.id=1;
				for(var i=0;i<sails.concerto.noIns;i++){
					if((i+1)!=req.params.id){
						sails.sockets.blast({cmd:'mute',insNo:i+1});
						sails.concerto.ins[i+1] = 'mute';
					}
				}
		}
	},

	main:function(req,res){
		insNo = sails.concerto.counter;
		if(sails.concerto.counter==5)
			sails.concerto.counter = 1;
		else
			sails.concerto.counter++;
		return res.view('howler',{insNo:insNo});
	}
};
