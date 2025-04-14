try {

    const registerForm = document.querySelector("#registerForm");
    const LoginForm = document.querySelector("#LoginForm");
    const logoutbtn = document.querySelector("#logoutbtn");
    const handleSearchBtn = document.querySelector("#handleSearchBtn");
    const editProfileForm = document.querySelector("#editProfileForm")
    const editBtn = document.querySelector("#editBtn")

    const profileInfoList = document.querySelector("#profileInfoList")

    let studentCount = 0

    let user = null;
    const projectName = "/student_management_system"
    let profileImage = `${projectName}/profiles/profile.png`

    $.get('get_user_session.php', function (response) {
        const path = window.location.pathname;

        if (response.status === 200) {
            user = response.user;
            console.log("User session loaded:", user);

            // Redirect if already logged in
            if (path.includes('login.html') || path.includes('register.html')) {
                window.location.href = "index.html";
            }

            // Set fallback profile image
            const profileSrc = user.profile_url
                ? `${projectName}/profiles/${user.profile_url}`
                : `${projectName}/profiles/profile.png`;

            // === GLOBAL Sidebar Info ===
            const sidebarImg = document.querySelector('#profileSidebar1');
            const sidebarEmail = document.querySelector('#log_user');

            if (sidebarImg) sidebarImg.src = profileSrc;
            if (sidebarEmail) sidebarEmail.textContent = user.email;

            // === PROFILE PAGE ONLY ===
            if (profileInfoList) {
                const profile_Image = document.querySelector("#userProfile");
                const userNameLabel = document.querySelector("#userNameLabel");

                if (profile_Image) profile_Image.src = profileSrc;
                if (userNameLabel) {
                    $("#userNameLabel").text(`${user.first_name} ${user.last_name}`);
                }

                $("#courseLabel").text(user.course);
                $('#profileSidebar2').attr('src', profileSrc);

                profileInfoList.innerHTML = "";

                const infoItems = [
                    { label: "Email", value: user.email },
                    { label: "Phone Number", value: user.phone_number },
                    { label: "Gender", value: user.gender },
                    { label: "Address", value: user.user_address },
                    { label: "Birthdate", value: user.birthdate },
                    { label: "Account Verified", value: user.is_verified ? "Yes" : "No" },
                    { label: "Date Created", value: user.date_created }
                ];

                infoItems.forEach(item => {
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
                    profileInfoList.appendChild(li);
                });
            }

        } else {
            if (!path.includes('login.html') && !path.includes('register.html')) {
                window.location.href = "login.html";
            }
        }
    });

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
            formData.append("student_id", user.student_id)

            $.ajax({
                url: "edit_student.php",
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
                        window.location.href = 'logout.php'
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
                studentCount = response.data.length
                $('#student_count').text(studentCount);
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
            $row.find('.tdImg').attr('src', student.profile_url ? `${projectName}/profiles/${student.profile_url}` : `${projectName}/profiles/profile.png`);

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

        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hours = hours.toString().padStart(2, '0');
        const time = `${hours}:${minutes} ${amPm}`;

        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);

        const fullDateTime = `${formattedDate} ${time}`;

        document.getElementById('digitalClock').textContent = fullDateTime;
    }
    $("#system_health").text("Good");

    setInterval(updateClock, 1000);
    updateClock();
} catch (error) {
    $("#system_health").text("Bad");
    console.error("An error occurred:", error);
}