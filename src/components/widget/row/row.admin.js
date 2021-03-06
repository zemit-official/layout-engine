/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Row widget
	 */
	Zemit.widgets.init('row', {
		defaultValues: {
			fullWidth: false
		},
		injectable: {
			section: 'structure',
			title: 'Row',
			desc: 'Row and columns',
			icon: 'columns',
		},
		drop: {
			outside: {
				accept: function(draggedWidget, currentWidget) {
					return draggedWidget.type === 'row'
						|| currentWidget.getParent().type === 'column';
				},
				decline: false
			}
		},
		defaultTemplate: false,
		settings: {
			title: 'Row',
			controller: function($s, $e, $di, attrs) {
				
			}
		},
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
			
			$s.addColumns = function(amount) {
				
				$s.row.getParent().isSelectable = true;
				
				$zm.action(function() {
					for(var i = 0; i < amount; i++) {
						$s.row.addNewChild('column', undefined, {
							size: (12 / amount)
						});
					}
				}, $s.row.childs);
			};
			
			$s.row.getParent().isSelectable = false;
			
			// Add default column if no columns available
			// if($s.row.childs.length === 0) {
			// 	$s.row.addNewChild('column');
			// }
		}
	});
})();