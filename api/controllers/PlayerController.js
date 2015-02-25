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
	console.log(data);
	sails.sockets.blast(data);
    return res.json({
      todo: 'start() is not implemented yet!'
    });
  },


  /**
   * `PlayerController.stop()`
   */
  stop: function (req, res) {
	sails.sockets.blast({cmd:'stop'});
    return res.json({
      todo: 'stop() is not implemented yet!'
    });
  },


  /**
   * `PlayerController.pause()`
   */
  pause: function (req, res) {
	sails.sockets.blast({cmd:'pause'});
    return res.json({
      todo: 'pause() is not implemented yet!'
    });
  },


  /**
   * `PlayerController.resume()`
   */
  resume: function (req, res) {
	sails.sockets.blast({cmd:'resume'});
    return res.json({
      todo: 'resume() is not implemented yet!'
    });
  }
};

