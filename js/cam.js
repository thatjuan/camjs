;(function($) {

    $.camJS = function(el, options) {

        var defaults = {
            propertyName: 'value',
            onSomeEvent: function() {}
        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;
            
            renderCameraGrid();

        };


        var renderCameraGrid = function(){

            $.each( plugin.settings.cameras, function(index, camera){

                if( !index || (index % 3 == 0) ){
                    $cam_row = $( '<div class="row-fluid camera-row">' ).appendTo(plugin.el);
                }

                $cam_span = $( '<div class="span4"></div>' );
                    makeCameraTile( camera ).appendTo( $cam_span );
                $cam_span.appendTo( $cam_row );

                $cam_span.find('div.viewport').click(function(){ switchToFullScreen( camera ); });

            });


        };


        var makeCameraTile = function( camera ){

            $cam_box = $( '<div>' )
                .addClass( 'camera' );

                $cam_viewport = $( '<div>' )
                    .addClass( 'viewport' )
                .appendTo( $cam_box );

                    $cam_img = $( '<img>' ) 
                        .attr( 'src', camera.url + camera.stream_route )
                    .appendTo( $cam_viewport );

                $control_box = $( '<div>' )
                    .addClass( 'bar' )
                .appendTo( $cam_box );

                    $control_motion_buttons = $( '<div>' )
                        .addClass( 'motion-buttons' )
                    .appendTo( $control_box );
                        
                        $motion_up = $( '<i>' )
                            .addClass( 'icon-chevron-up' )
                            .appendTo(
                                $( '<a href="#">' ).addClass( 'btn btn-large' )
                                    .appendTo( $control_motion_buttons )
                            )
                        .mousedown( function(){ moveCamera(camera, 'up', 'start'); return false; } ) 
                        .mouseup( function(){ moveCamera(camera, 'up', 'end'); return false; } );   

                        $motion_down = $( '<i>' )
                            .addClass( 'icon-chevron-down' )
                            .appendTo(
                                $( '<a href="#">' ).addClass( 'btn btn-large' )
                                    .appendTo( $control_motion_buttons )
                            )
                        .mousedown( function(){ moveCamera(camera, 'down', 'start') } )
                        .mouseup( function(){ moveCamera(camera, 'down', 'end') } );  

                        $motion_left = $( '<i>' )
                            .addClass( 'icon-chevron-left' )
                            .appendTo(
                                $( '<a href="#">' ).addClass( 'btn btn-large' )
                                    .appendTo( $control_motion_buttons )
                            )
                        .mousedown( function(){ moveCamera(camera, 'left', 'start') } )
                        .mouseup( function(){ moveCamera(camera, 'left', 'end') } );  

                        $motion_right = $( '<i>' )
                            .addClass( 'icon-chevron-right' )
                            .appendTo(
                                $( '<a href="#">' ).addClass( 'btn btn-large' )
                                    .appendTo( $control_motion_buttons )
                            )
                        .mousedown( function(){ moveCamera(camera, 'right', 'start') } )
                        .mouseup( function(){ moveCamera(camera, 'right', 'end') } );  



            return $cam_box;

        };


        var removeCameraGrid = function(){

            $(plugin.el).find('div.camera-row').remove();

        };



        var renderFullScreenCamera = function( camera ){

            $cam_row = $( '<div class="row-fluid full-screen-camera-row">' )
                .appendTo( plugin.el );

            $cam_span = $( '<div class="span12"></div>' );
                makeCameraTile( camera ).appendTo( $cam_span );
            $cam_span.appendTo( $cam_row );

            $cam_span.find('div.viewport').click(function(){ switchToGridScreen( camera ); });

        };


        var removeFullScreenCamera = function( camera ){

            $(plugin.el).find('div.full-screen-camera-row').remove();

        };


        var switchToFullScreen = function( camera ){

            removeCameraGrid();

            renderFullScreenCamera( camera );

        };


        var switchToGridScreen = function(){

            removeFullScreenCamera();

            renderCameraGrid();

        };



        var moveCamera = function( camera, direction, action ){

            var command = 0;

            var is_start = action == 'start';

            switch( direction ){
                case 'up':
                    
                    command = is_start ? 0 : 1;

                break;

                case 'down':
                    
                    command = is_start ? 2 : 3;

                break;

                case 'left':

                    command = is_start ? 4 : 5;

                break;

                case 'right':
                    
                    command = is_start ? 6 : 7;

                break;
            };

            $.ajax({
                url: camera.url + camera.control_route,
                data: {
                    command: command
                }
            }).done(function(){
            });


        };




        init();

    }

})(jQuery);