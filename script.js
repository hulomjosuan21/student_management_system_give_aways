let user = null;
const projectName = "/student_management_system"

$.get('get_user_session.php', function (response) {
    if (response.status === 200) {
        user = response.user;
        console.log("Welcome", user.first_name);

        const path = window.location.pathname;
        if (path.includes('login.html') || path.includes('register.html')) {
            window.location.href = "index.html";
        }

    } else {
        const path = window.location.pathname;
        if (!path.includes('login.html') && !path.includes('register.html')) {
            window.location.href = "login.html";
        }
    }
});

const registerForm = document.querySelector("#registerForm");
const LoginForm = document.querySelector("#LoginForm");
const logoutbtn = document.querySelector("#logoutbtn");
const handleSearchBtn = document.querySelector("#handleSearchBtn");
const editProfileForm = document.querySelector("#editProfileForm")
const editBtn = document.querySelector("#editBtn")

if (editBtn) {
    editBtn.addEventListener("click", function (e) {
        if (!user) return
        for (const key in user) {
            if (user.hasOwnProperty(key)) {
                const input = editProfileForm.querySelector(`[name="${key}"]`);

                if (input) {
                    if (input.type === "file") {
                        continue;
                    } else if (input.tagName === "SELECT") {
                        input.value = user[key];
                    } else {
                        input.value = user[key];
                    }
                }
            }
        }
    })
}

if (editProfileForm) {
    editProfileForm.addEventListener("submit", function (e) {
        e.preventDefault()

        const formData = new FormData(this)

        $.ajax({
            url: "register_student.php",
            type: "POST",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false
        }).done((response) => {
            try {
                const responseData =
                    typeof response === "string" ? JSON.parse(response) : response;

                if (responseData.status == 200) {
                    alert(responseData.message);
                    window.close();
                } else {
                    throw new Error(responseData.message);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert("AJAX Error: " + textStatus + " - " + errorThrown);
        });
    })
}

if (logoutbtn) {
    logoutbtn.addEventListener("click", function (e) {
        e.preventDefault();
        $.ajax({
            url: 'logout.php',
            type: 'POST',
            success: function (response) {
                if (response.status === 200) {
                    alert(response.message);
                    window.location.href = "login.html";
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Something went wrong. Please try again.");
            }
        });
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: "register_student.php",
            type: "POST",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false
        }).done((response) => {
            try {
                const responseData =
                    typeof response === "string" ? JSON.parse(response) : response;

                if (responseData.status == 200) {
                    alert(responseData.message);
                    window.close();
                } else {
                    throw new Error(responseData.message);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert("AJAX Error: " + textStatus + " - " + errorThrown);
        });
    });
}

if (LoginForm) {
    LoginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            url: 'login_student.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                if (response.status === 200) {
                    alert(response.message);
                    window.location.href = "index.html";
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Something went wrong. Please try again.");
            }
        });
    })
}

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');
const verificationCode = urlParams.get('code');

if (userId && verificationCode) {
    // console.log(userId, verificationCode);
    verifyAccount(userId, verificationCode);
} else {
    $('#verification-message').html('<p>Invalid verification link.</p>');
}

function verifyAccount(userId, verificationCode) {
    $('#verification-message').html('<p>Verifying your account...</p>');

    $.ajax({
        url: 'verify_account.php',
        type: 'POST',
        data: {
            user_id: userId,
            code: verificationCode
        },
        dataType: 'json',
        success: function (response) {
            if (response.status === 200) {
                $('#verification-message').html('<p>Your account has been successfully verified! You can now <a href="login.html">log in</a>.</p>');
            } else {
                $('#verification-message').html('<p>Verification failed. Please check the link and try again.</p>');
            }
        },
        error: function () {
            $('#verification-message').html('<p>There was an error processing your request. Please try again later.</p>');
        }
    });
}

fetchStudents('');

if (handleSearchBtn) {
    handleSearchBtn.addEventListener("click", function () {
        let keyword = $('#searchInput').val().trim();
        fetchStudents(keyword);
    })
}

function fetchStudents(keyword = '') {
    $.ajax({
        url: 'get_all_students.php',
        type: 'POST',
        data: { keyword: keyword },
        dataType: 'json',
        success: function (response) {
            if (response.status === 200 && Array.isArray(response.data)) {
                populateTable(response.data);
            } else {
                $('#tableBody').html(`<tr><td colspan="12" class="text-center">${response.message || 'No results found.'}</td></tr>`);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', error);
        }
    });
}

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--
    }
    return age
}

const template = document.querySelector('#template_row');

function populateTable(data) {
    const tbody = $('#tableBody');
    tbody.html('');


    if (!template) {
        console.error('Template not found!');
        return;
    }

    data.forEach((student, index) => {
        const clone = template.content.cloneNode(true);
        const $row = $(clone);

        $row.find('.trId').text(index + 1);
        console.log(student.profile_url);
        $row.find('.tdImg').attr('src', student.profile_url ? `${projectName}/profiles/${student.profile_url}` : `${projectName}/student_management_system/profiles/profile.png`);

        $row.find('.trFname').text(student.first_name);
        $row.find('.trLname').text(student.last_name);
        $row.find('.trEmail').text(student.email);
        $row.find('.trPNum').text(student.phone_number);
        $row.find('.trGender').text(student.gender);
        $row.find('.trCourse').text(student.course);
        $row.find('.trAddress').text(student.user_address);
        $row.find('.trAge').text(calculateAge(student.birthdate));

        const $statusBadge = $row.find('.trStatus .badge');
        if (student.is_verified == 1) {
            $statusBadge.text('Verified');
            $statusBadge
                .removeClass()
                .addClass('badge text-bg-success');
        } else {
            $statusBadge.text('Not Verified');
            $statusBadge
                .removeClass()
                .addClass('badge text-bg-danger');
        }

        tbody.append($row);
    });
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    document.getElementById('digitalClock').textContent = time;
}

setInterval(updateClock, 1000);
updateClock();