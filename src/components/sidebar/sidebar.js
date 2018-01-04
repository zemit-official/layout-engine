(function() {
	Zemit.app.directive('zmSidebar', ['$session', '$device', function($session, $device) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.sidebar = $s;
				
				var session = $session.get();
				$session.prepare({
					sidebar: {
						tabs: {
							workspace: {
								visible: false
							},
							advanced: {
								visible: false
							},
							widgets: {
								visible: $device.isLargeEnough()
							},
							debug: {
								visible: false
							}
						}
					}
				});
				
				$s.toggleDebug = () => {
					
					if(session.debug && session.sidebar.tabs.debug.visible) {
						$s.tabs.toggle('debug');
					}
					
					session.debug = !session.debug;
				};
				
				$s.tabs = {
					
					showContent: false,
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						if(this.showContent) {
							$s.container.getScope().showContent = false;
						}
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						
						if(this.showContent) {
							$s.container.getScope().showContent = true;
						}
						
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(session.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(session.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						show ? this.show() : this.hide();
						
						if(show) {
							this.unhideAll();
						}
					},
					
					show: function() {
						
						this.showContent = true;
						$s.container.getScope().showContent = true;
					},
					
					hide: function() {
						
						this.showContent = false;
						$s.container.getScope().showContent = false;
					},
					
					toggle: function(name) {
						
						angular.forEach(session.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						session.sidebar.tabs[name].visible = !session.sidebar.tabs[name].visible;
						this.updateShowContent();
					}
				};
				
				$s.tabs.init();
				$s.sidebar.tabs = $s.tabs;
				$s.session = session;
			}
		};
	}]);
})();