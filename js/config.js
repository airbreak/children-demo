/**
 * Created by airbreak on 2016/5/10.
 */

requirejs.config({
    baseUrl: 'js',
    paths: {
        $:'zepto.min',
        // $:'jquery.min',
        base:'base',
        fastclick:'fastclick',
        lazyloading:'lazyloading',
        index:'index',
    },
    shim: {
        $:{
            output:'$'
        },
        
        fastclick:{
            output:'fastclick'
        },
    }
});


require(['index'],function(baby){
    new baby();
});