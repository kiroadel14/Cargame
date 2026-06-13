// 1. إعداد المشهد (Scene) والكاميرا والريندر
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // لون السما

// الكاميرا (مجال الرؤية، الأبعاد، أقرب نقطة، أبعد نقطة)
const camera = new THREE.PerspectiveCamera(75, 400 / 700, 0.1, 1000);
camera.position.set(0, 5, 10); // الكاميرا ورا العربية وفوقها شوية
camera.lookAt(0, 0, 0); // بتبص على مركز اللعبة

const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias لتنعيم الحواف
renderer.setSize(400, 700);
renderer.shadowMap.enabled = true; // تفعيل الظلال
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. الإضاءة (عشان الألوان والظلال تظهر)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // إضاءة عامة
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // إضاءة شمس
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

// 3. بناء العالم (الطريق)
const roadGeometry = new THREE.PlaneGeometry(10, 100);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // تنويم الطريق على الأرض
road.receiveShadow = true;
scene.add(road);

// خطوط الطريق (هنعمل كذا خط أبيض ونحركهم)
const lines = [];
const lineGeo = new THREE.PlaneGeometry(0.5, 3);
const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
for(let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.01, -i * 10); // توزيع الخطوط
    scene.add(line);
    lines.push(line);
}

// 4. سيارة اللاعب (مؤقتاً مكعب أحمر 3D لحد ما نضيف موديل عربية)
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerCar = new THREE.Mesh(carGeometry, carMaterial);
playerCar.position.y = 0.5; // رفعها فوق الأرض
playerCar.castShadow = true;
scene.add(playerCar);

// 5. محرك الحركة (Animation Loop)
let isPaused = false;
let speed = 0.2;

function animate() {
    requestAnimationFrame(animate);

    if (!isPaused) {
        // تحريك خطوط الطريق ناحية الكاميرا عشان يدي إحساس إنك ماشي لقدام
        lines.forEach(line => {
            line.position.z += speed;
            if (line.position.z > 10) {
                line.position.z = -40; // لما الخط يخرج بره الشاشة يرجع ورا تاني
            }
        });
    }

    renderer.render(scene, camera);
}
animate();

// 6. تشغيل شاشة السؤال بعد 4 ثواني
setTimeout(() => {
    isPaused = true; // توقف اللعبة الـ 3D
    document.getElementById('question-modal').classList.remove('hidden');
}, 4000);

// لما اللاعب يضغط على أي إجابة اللعبة ترجع تكمل
const buttons = document.querySelectorAll('.ans-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('question-modal').classList.add('hidden');
        isPaused = false; // اللعبة تكمل
    });
});