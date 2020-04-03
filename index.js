
const vash = require('vash');
const fp = require('fastify-plugin');

function vashViewRenderer(fastify, opts, done) {

  const defaultOpts = {
      settings:
      {
          views: './views',
          'view engine': 'vash'
      },
      cache: true
  };
  vash.config = { ...vash.config, ...defaultOpts, ...opts };

  function render(filename, model) {

    return new Promise((resolve, reject) => {

      vash.loadFile(filename, null, (err, tpl) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        tpl(model, (err, ctx) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(ctx.finishLayout());
        });
      });

    }); 


  }

  fastify.decorateReply('view', function (filename, model) {
    return render(filename, model).then((html)=>{
      this.type('text/html').send(html);
    });
  });

  done();
}
module.exports = fp(vashViewRenderer, { fastify: '^2.x' });