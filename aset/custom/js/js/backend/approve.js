var mobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(
	navigator.userAgent.toLowerCase()
);
var host = window.location.origin + "/";
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var pageLoc = window.location.href.split("/").pop();

var url_list = host + "Approval/ajax_list/";
var url_email = host + "Approval/getEmail/";
var url_save = host + "Approval/save/";

var modul = "";
var app = "";
var page_name;
var menuid;
var MarkerClick = true;
var NextID = "0";
var PrevID = "0";
var method_before;
var LastID;
var count_dd = 0;
var RequestDetIDArr = [];
var ListAttachIDArr = [];
var tempArr = [];
var list_branch = [];
var MOBILE = $(".data-page, .page-data").data().device;

$(document).ready(function () {
	getDataBranch()
	const checkIsFilled = (resolve) => {
		if (list_branch.length > 0) {
			resolve(); 
		} else {
			setTimeout(() => checkIsFilled(resolve), 100);
		}
	};
	waitPromise(checkIsFilled)
    .then(() => {
		load_datatables();
	});
	$(".select2").select2();
});

function load_datatables() {
	$(".table tbody").empty();
	$("#btnCancel").hide();
	$.ajax({
		url: url_list,
		type: "POST",
		dataType: "JSON",
		success: function (data) {
			console.log(data);
			level = data.AppLevel;
			list = data.list;

            if(level){
                $("#JumlahApproval").val(level.nValue).trigger("change");
                $("[name = 'ApproveLevelID']").val(level.ApprovalLevelID);
            }
			$.each(list, function (i, v) {
				count_dd += 1;
				var branchIDs = JSON.parse(v.BranchID); // Ubah string JSON menjadi array JavaScript
				var item = `
					<tr class="approval${v.ApprovalType}-${count_dd}">
						<input type="hidden" name="totalApprove${v.ApprovalType}[]" value="${count_dd}">
						<input type="hidden" name="totalApprove[]" value="${count_dd}">
						<input type="hidden" name="dataApprove[]" value="${v.ApprovalType}">
						<input type="hidden" name="ApproveID[]" value="${v.ApprovalID}">
						<input type="hidden" name="userEdit[]" id="userEdit-${count_dd}">
						<td style="cursor: pointer; vertical-align: middle;">
							<a href="javascript:void(0)" data-ID="${v.ApprovalID}" onclick="remove_row(this)"><i class="ti-trash"></i></a>
						</td>
						<td style="vertical-align: middle;">
							<select name="Email[]" id="Email-${count_dd}" type="text" class="form-control select2 email" onchange="changeUser(${count_dd}, 0)">
								<option value="${v.UserID}">${v.Email}</option>
							</select>
						</td>
						<td style="vertical-align: middle;">
							<select name="Approval[]" id="Approval-${count_dd}" type="text" class="form-control approval">
								<option value="${v.Approval}">${v.Approval}</option>
							</select>
						</td>
						<td>
							<select name="BranchID[${count_dd}][]" id="BranchID-${count_dd}" type="text" class="form-control branch_all select2 js-select2 main-input" data-active="1" data-modul="transaction_all" multiple="multiple">
								<option value="all">All</option>	
							`;
								list_branch.forEach(branch => {
									item += `<option value="${branch.CompanyID}" ${branchIDs.includes(branch.CompanyID) ? 'selected' : ''}>${branch.Name}</option>`;
								});
								item += `
							</select>
						</td>
					</tr>
				`;
				$("#table" + v.ApprovalType + " tbody").append(item);
			});
			
			setEmail(null);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.responseText);
		},
	});
}

function tambah(modul) {
	count_dd = 0;
	save_method = "add";
	$(".form-title").text("Tambah Data");
	$(".table-data-detail tbody").empty();
	$(".table-data-detail tfoot .action").show();
	$(".table-data-detail tfoot .item-total").text("");
	div_form("open");
	$("#ApprovalType").val("none").trigger("change");
	$("#Email").val("none").trigger("change");
	$("#Approval").val("none").trigger("change");
}

function changeApproval(id = null) {
	jml = $("#JumlahApproval").val();

	data = `<option value="none">Pilih Approval</option>`;
	for (var i = 1; i <= jml; i++) {
		data += `<option value="${i}">${i}</option>`;
	}
	if (id == "load") {
		$(".approval").empty();
		$(".approval").append(data);
	} else if (id != null) {
		$("#Approval-" + id).empty();
		$("#Approval-" + id).append(data);
	} else {
		$(".approval").append(data);
	}
}

function addNewRow(id) {
	count_dd += 1;
	$("#loader").show();
	item = `
        <tr class="approval${id}-${count_dd}">
            <input type="hidden" name="totalApprove${id}[]" value="${count_dd}">
            <input type="hidden" name="totalApprove[]" value="${count_dd}">
            <input type="hidden" name="dataApprove[]" value="${id}">
            <input type="hidden" name="ApproveID[]" value="0">
            <input type="hidden" name="userEdit[]" id="userEdit-${count_dd}">
            <td style="cursor: pointer; vertical-align: middle;">
                <a href="javascript:void(0)" data-ID="0" onclick="remove_row(this)"><i class="ti-trash"></i></a>
            </td>
            <td>
                <select name="Email[]" id="Email-${count_dd}" type="text" class="form-control select2" onchange="changeUser(${count_dd}, 1)">
                    <option value="none">Loading...</option>
                </select>
            </td>
            <td>
                <select name="Approval[]" id="Approval-${count_dd}" type="text" class="form-control approval">
                    <option value="none">Loading...</option>
                </select>
            </td>
			<td>
				<select name="BranchID[${count_dd}][]" id="BranchID-${count_dd}" type="text" class="form-control branch_all select2 js-select2 main-input" data-active="1" data-modul="transaction_all" multiple="multiple">
					<option value="none">Loading...</option>
				</select>
			</td>
        </tr>
    `;
	$("#table" + id + " tbody").append(item);
	setEmail(count_dd, id);
	setBranch(count_dd);
}

function getDataBranch(){
	$("#loader").show();
	$.ajax({
		url: host + "main/getBranch/",
		type: "POST",
		dataType: "JSON",
		success: function (data) {
			list_branch = data.list
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.responseText);
		},
	});
}
function setBranch(id = null, branch = null) {
	if(id){
		$("#BranchID-" + id).empty();
	}

	item = `
		<option value="none">Pilih Branch</option>
		<option value="all">All</option>
	`;
	$.each(list_branch, function (i, v) {
		item += `<option value="${v.CompanyID}">${v.Name}</option>`;
	});
	
	if(id){
		$("#BranchID-" + id).append(item);
	}
}

function setEmail(id = null, approval = null) {
	$.ajax({
		url: url_email + approval,
		type: "POST",
		dataType: "JSON",
		success: function (data) {
			list = data.list;
			if (id != null) {
				$("#Email-" + id).empty();
			}
			itemEmail = `<option value="none">Pilih Email</option>`;
			$.each(list, function (i, v) {
				itemEmail += `<option value="${v.id_user}">${v.email}</option>`;
			});
			changeApproval(id);
			if (id != null) {
				$("#Email-" + id).append(itemEmail);
			} else {
				$(".email").append(itemEmail);
			}
			$(".select2").select2();
			$("#loader").hide();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.responseText);
		},
	});
}

function remove_row(element) {
	var approvalID = $(element).data("id");
    if(approvalID != 0){
        array = {
            AppID: approvalID,
        };
        tempArr.push(array);
        $("[name = data_hapus]").val(JSON.stringify(tempArr));
    }
	$(element).closest("tr").remove();
    $("#btnCancel").show();    
}

function save() {
	$("#loader").show();
	$("#btnSave").text("Menyimpan...");
	$("#btnSave").attr("disabled", true);
	var form = $("#form")[0];
	var formData = new FormData(form);
	$.ajax({
		url: url_save,
		type: "POST",
		data: formData,
		mimeType: "multipart/form-data",
		contentType: false,
		cache: false,
		processData: false,
		dataType: "JSON",
		success: function (data) {
			console.log(data);
			if (data.status) {
                tempArr = [];
				load_datatables();
				swal({ html: true, type: "success", title: "", text: data.message });
			} else {
				$(".modal").animate({ scrollTop: 0 }, "slow");
				if (data.message) {
					swal({ html: true, type: "warning", title: "", text: data.message });
				}
				$(".form-group").removeClass("has-error");
				$(".help-block").empty();
				if (data.inputerror) {
					$.each(data.inputerror, function (i, v) {
                        toastr.error(v, "Information");
                        // if (data.inputerror[i] != "") {
                        //     $("." + data.inputerror[i]).addClass("has-error");
                        //     $("." + data.inputerror[i] + ' .item-alert').show();
                        // }
                    });
				}
			}
			$("#loader").hide();
			$("#btnSave").text("Simpan");
			$("#btnSave").attr("disabled", false);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.responseText);
			alert("Error adding / update data");
			$("#loader").hide();
			$("#btnSave").text("Simpan");
			$("#btnSave").attr("disabled", false);
		},
	});
}

function changeUser(id, val){
    $("#userEdit-" + id).val(val)
    $("#btnCancel").show();    
}
