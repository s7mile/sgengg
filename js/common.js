$(function(){
	//tabmenu
	var tabmenu = {
		init: function() {
			this.func();
		},
		func: function() {
			$(".memberTab a").on("click", function(){
				var menuNav = $(this).next("ul");
				if (menuNav.is(":hidden")){
					$(menuNav).slideDown("fast");
				}else{
					$(menuNav).slideUp("fast");
				}
			});
		}
	}
	tabmenu.init();

	//menu select
	var menuSelect = {
		init: function() {
			this.func();
		},
		func: function() {
			var urlArr = location.pathname.split('/');
			var target = urlArr[2].split(".");
			$('nav li').each(function(index) {
				if(target[0].indexOf($(this).children("a").data("url"))	!== -1){
					$("html").children("a").text($(this).data("url"));
					$(this).children("a").addClass("sel");
				}
			});
		}
	}
	menuSelect.init();

	//counter -> date 출력
	var datePrint = {
		init: function() {
			this.func();
		},
		func: function() {
			var now = new Date(),
				year= now.getFullYear(),
				mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1),
				day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate(),
				week = new Array('일', '월', '화', '수', '목', '금', '토'),
				yoil = week[now.getDay()];

			var chan_val = year + '.' + mon + '.' + day + " " + yoil + "요일";
			$(".todaydate").text(chan_val);
			$("p.today").text('TODAY ' + year + '.' + mon + '.' + day);
		}
	}
	datePrint.init();

	//출석률 구하기
	var checkPerc = {
		init: function() {
			this.func();
		},
		func: function() {
			var total = 0,
				agree = $('.legend li:first').children("span").text();
			$('.legend li').each(function(index){
				total += parseInt($(this).children("span").text());
			});
			$(".checkPerc").text(Math.floor(agree/total * 100));
		}
	}
	checkPerc.init();

	var scrollEvent = {
		init: function() {
			this.func();
		},
		func: function() {
			$(document).on("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
				e.preventDefault();
				return;
			});
			$(document).on("keydown.disableScroll", function(e) {
				var eventKeyArray = [32, 33, 34, 35, 36, 37, 38, 39, 40];
				for (var i = 0; i < eventKeyArray.length; i++) {
					if (e.keyCode === eventKeyArray [i]) {
						e.preventDefault();
						return;
					}
				}
			});
		}
	}

	//공지사항
	var noticeBtn = {
		init: function() {
			this.func();
		},
		func: function() {
			//글쓰기 폼 보이기
			$(".writeBtn").on("click", function(){
				$(".writeWrap").show();

				//스크롤 막기
				scrollEvent.init();
			});

			//닫기
			$(".writeWrap .bg, .close").on("click", function(){
				$(".writeWrap").hide();
				//스크롤 활성화
				$(document).off(".disableScroll");
			});
		}
	}
	noticeBtn.init();

	//멤버상세보기
	var memberView = {
		init: function() {
			this.func();
		},
		func: function() {
			$(".memberList a").on("click", function(){
				$(".memberInfo").show();

				//스크롤 막기
				scrollEvent.init();
			});

			//닫기
			$(".bg, .close").on("click", function(){
				$(".memberInfo").hide();
				//스크롤 활성화
				$(document).off(".disableScroll");
			});
		}
	}
	memberView.init();

	var voteOn = {
		init: function() {
			this.func();
		},
		func: function() {
			var setBtn = $(".voteSetting"),
				set = $("#voteSetting");
			$(setBtn).on("click", function(){
				$(setBtn).removeClass("sel");
				$(this).addClass("sel");
				$(set).val($(this).data("set"));
			});
		}
	}
	voteOn.init();

	var voteSel = {
		init: function() {
			this.func();
		},
		func: function() {
			var setBtn = $("button.voteSel"),
				set = $("#voteSel");
			$(setBtn).on("click", function(){
				$(setBtn).removeClass("sel");
				$(this).addClass("sel");
				$(set).val($(this).data("set"));
			});
		}
	}
	voteSel.init();

	//members tab
	var memberTab = {
		init: function() {
			this.func();
		},
		func: function() {
			var tab = $(".leftWrap .tab");
			$(tab).on("click", function(){
				if($(this).next().is(":visible")){
					$(this).next().hide();
					$(this).removeClass("down");
					$(this).addClass("up");
				}else{
					$(this).next().show();
					$(this).removeClass("up");
					$(this).addClass("down");
				}
			});
		}
	}
	memberTab.init();

	//비콘추가
	var beaconAdd = {
		init: function() {
			this.func();
		},
		func: function() {
			//글쓰기 폼 보이기
			$(".addBeacon").on("click", function(){
				$(".beaconWrap").show();
			});

			//닫기
			$(".beaconWrap .bg").on("click", function(){
				$(".beaconWrap").hide();
			});
		}
	}
	beaconAdd.init();
});


function getUrlVars(type){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	if((type == "1") && (hashes[0] !== undefined) && (hashes[0] !== null)){
		hash = hashes[0].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
		return hash[1];
	}else if((hashes[1] !== undefined) && (hashes[1] !== null)){
		hash = hashes[1].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
		return decodeURI(hash[1]);
	}
	return null;
}