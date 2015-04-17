module.exports = function(grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
		concat: {
		  options: {
			separator: ';'
		  },
		  dist: {
			src: ['src/**/*.js'],
			dest: 'dist/<%= pkg.name %>.js'
		  }
		},
		uglify: {
		  options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		  },
		  dist: {
			files: {
			  'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
			}
		  }
		},
		copy:{
			main:{
			files:[
				{expand:true,
				cwd:'src/',
				src:'**/*.html',
				dest:'dist/'},
				{expand:true,
				cwd:'src/assets/',
				src:'**/*',
				dest:'dist/assets'}
			]
			}
	},
		watch:{
			files:['src/**/*.js','src/**/*.html'],
			tasks:['concat','uglify','copy']
		}
    });
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['concat','uglify','copy']);
};