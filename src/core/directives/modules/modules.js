/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarModules', ['$zm', '$modal', '$i18n', '$modules', '$session', '$filter', '$hook', function($zm, $modal, $i18n, $modules, $session, $filter, $hook) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/directives/modules/modules.html',
			link: function ($s, $e, attrs) {
				
				let settings = $session.get('settings');
				
				$session.prepare('settings', {
					modules: {},
					sidebar: {
						modules: {
							tabs: {}
						}
					},
				});
				
				$s.filters = {
					query: ''
				};
				$s.groups = $modules.items;
				$s.filteredGroups = [];
				$s.tabs = settings.sidebar.modules.tabs;
				$s.settings = angular.copy(settings.modules);
				$s.$modules = $modules;
				
				$s.toggle = (module, isActivated) => {
					
					if(!isActivated && module.props.onActivate instanceof Function) {
						module.activate();
						module.props.onActivate();
					}
					else if(isActivated && module.props.onDeactivate instanceof Function) {
						module.deactivate();
						module.props.onDeactivate();
					}
				};
				
				$s.hasDifferences = () => {
					
					let keys = Object.keys($s.settings);
					for(let i = 0; i < keys.length; i++) {
						
						let module = $s.settings[keys[i]];
						
						if(module.activated !== settings.modules[keys[i]].activated) {
							return true;
						}
					}
					
					return false;
				};
				
				$s.apply = () => {
					
					$modal.dialog('modules_apply', {
						backdrop: true,
						title: $i18n.get('core.directives.sidebar.modules.applyTitle'),
						content: $i18n.get('core.directives.sidebar.modules.applyContent'),
						buttons: [{
							label: $i18n.get('core.directives.sidebar.modules.applyBtn'),
							warning: true,
							callback: (event, modal) => {
								
								settings.modules = angular.copy($s.settings);
								$session.save();
								
								setTimeout(() => {
									window.location.reload();
								}, 250);
								
								modal.close();
							}
						}, {
							label: $i18n.get('core.di.modal.btnCancel'),
							default: true
						}, ]
					});
				};
				
				let loadFilteredGroups = () => {
					
					let results = [];
					for(let group in $s.groups) {
						results.push($s.groups[group]);
					}
					
					if(!$s.filters.query) {
						$s.filteredGroups = results;
					}
					
					let groups = [];
					let originalGroups = angular.copy(results);
					originalGroups.forEach((group) => {
						let found = $filter('search')(group.modules, (module) => {
							return module.title + ' ' + module.desc + ' ' + group.title;
						}, $s.filters.query, true);
						
						if(found.length > 0) {
							group.modules = found
							groups = groups.concat(group);
						}
					});
					
					// Prevent ng-repeat reconstruction..
					if(Object.keys($s.filteredGroups).length !== Object.keys(groups).length) {
						$s.filteredGroups = groups;
					}
				};
				$hook.add('onReady', () => {
					loadFilteredGroups();
				});
				
				['groups', 'filters.query'].forEach(toWatch => {
					$s.$watch(toWatch, (nv, ov) => {
						loadFilteredGroups();
					});
				});
			}
		}
	}]);
})();