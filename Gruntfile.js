module.exports = function (grunt) {
	grunt.initConfig({
		watch: {
			fest: { /* Подзадача */
				files: ['templates/*.xml'], /* следим за шаблонами */
				tasks: ['fest'], /* перекомпилировать */
				options: {
					atBegin: true /* запустить задачу при старте */
				}
			}
		},
		connect: {
			server: { /* Подзадача */
				options: {
					//keepalive: true, /* работать постоянно */
					port: 8000, /* номер порта */
					base: 'public' /* публичная директория */
				}
			}
		},
		fest: {
			templates: {
				files: [{
					expand: true,
					cwd: 'templates', /* исходная директория */
					src: '*.xml', /* имена шаблонов */
					dest: 'public/js/tmpl' /* результирующая директория */
				}],
				options: {
					template: function (data) { /* формат функции-шаблона */
						var result =  grunt.template.process('var <%= name %>Tmpl = <%= contents %> ;', {data: data});
						return result;
					}
				}
			},
				
		},
		 
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-fest');

	grunt.registerTask('default', ['connect', 'watch']);
};
