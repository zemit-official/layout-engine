/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Row widget
	 */
	Zemit.app.onReady(['$i18n', function($i18n) {
		
		// Initialize widget
		Zemit.widgets.register('core/components/widget/row');
		
		Zemit.widgets.init('row', {
			defaultValues: {
				fullWidth: false
			},
			injectable: {
				section: 'structure',
				title: $i18n.get('core.components.widget.row.title'),
				desc: $i18n.get('core.components.widget.row.desc'),
				icon: 'window-minimize',
			},
			drop: {
				outside: {
					accept: '*',
					//decline: 'column'
				}
			},
			defaultTemplate: false,
			controller: function($s, $e, $di, attrs) {
				
				var $zm = $di.get('$zm');
				
				// Set row scope to widget
				$s.row = $s.widget;
				
				$s.previewer = {
					columns: [1,2,3,4,6],
					hoveredAmount: 1
				};
				
				// Set default widget values
				if(!$s.isInsideColumn) {
					$s.$element = $e;
				}
				
				$s.countColumns = () => {
					
					var count = 0;
					
					$s.widget.forEachChilds((widget) => {
						count += widget.size;
					});
					
					return count;
				};
				
				$s.addColumns = function(amount) {
					
					//$s.row.getParent().getScope().isSelectable = true;
					
					$zm.action(function() {
						for(var i = 0; i < amount; i++) {
							$s.row.addChild('column', undefined, {
								size: (12 / amount)
							});
						}
					}, $s.row.childs);
				};
				
				// $s.hooks.add('onLoad', ($element) => {
				// 	$s.row.getParent().getScope().isSelectable = false;
				// });
				
				// Add default column if no columns available
				// if($s.row.childs.length === 0) {
				// 	$s.row.addChild('column');
				// }
			}
		});
	}]);
})();