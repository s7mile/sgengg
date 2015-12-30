$(function(){
	var loginProc = {
		init: function() {
			this.func();
		},
		func: function() {
			$("#loginBtn").on("click", function(){
				var userId = $("#userId").val();
				var userPw = $("#userPw").val();
				$.ajax({
					url:'/webLogin',
					type:'GET',
					data:{id:userId, password:userPw},
					success:function(result){
						console.log(result);
						if(result == 1)
							location.href="/page/place.html";
						else
							alert("아이디 또는 비밀번호가 다릅니다");
					}
				});
			});
		}
	}
	loginProc.init();

	var beaconProc = {
		init: function() {
			this.func();
		},
		func: function() {
			$("#beaconAddBtn").on("click", function(){
				var beaconNum = $("#beaconNum").val(),
					placeName = $("#placeName").val();
					//planOn -> 일시 없으면 0 있으면 1
				$.ajax({
					url:'/setBeacon',
					type:'GET',
					data:{
						beaconNum: beaconNum,
						placeName: placeName
					},
					success:function(result){
						console.log(result);
						location.reload();
					}
				});
			});
		}
	}
	beaconProc.init();
});