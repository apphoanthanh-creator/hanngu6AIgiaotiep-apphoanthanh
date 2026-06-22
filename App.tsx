
import React, { useState, FormEvent, useEffect } from 'react';
import LessonButton from './components/LessonButton';
import ChatView from './components/ChatView';
import ApiKeyInput from './components/ApiKeyInput';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('saved-username') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('saved-password') || '');
  const [error, setError] = useState('');

  const totalLessons = 13;
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));

  const lessonTitles = [
    "Bốn câu chuyện hài hước", "Một tai nạn nhỏ", "Ý nghĩa của 'Chậm một chút'", "Không trải qua mưa gió sao thấy được cầu vồng", "Một sự ngộ nhận đẹp đẽ",
    "Thủ ngữ đẹp đẽ", "Lạm dụ充 số & Tự tương mâu thuẫn", "Một trải nghiệm đẹp đẽ", "Hạnh phúc", "Trường học mạng thời đại mới", "Chỉ số cảm xúc",
    "Màu sắc", "Lương Sơn Bá và Chúc Anh Đài"
  ];

  // Interface for custom user validation criteria
  interface UserConfig {
    username: string;
    password: string;
    isValid: (year: number, month: number) => boolean;
    description: string;
  }

  const isEven = (y: number) => y % 2 === 0;
  const isOdd = (y: number) => y % 2 !== 0;

  // List of users with custom monthly options based on year oddity
  const USERS: UserConfig[] = [
    {
      username: 'admin',
      password: '9916',
      isValid: () => true,
      description: 'tất cả các tháng, tất cả các năm'
    },
    // Nhóm lẻ chủ đạo
    {
      username: 'deuz',
      password: '601',
      isValid: (y, m) => isOdd(y) && [1, 2, 3, 4, 5, 6].includes(m),
      description: 'tháng 1, 2, 3, 4, 5, 6 năm lẻ'
    },
    {
      username: 'dzug',
      password: '602',
      isValid: (y, m) => isOdd(y) && [2, 3, 4, 5, 6, 7].includes(m),
      description: 'tháng 2, 3, 4, 5, 6, 7 năm lẻ'
    },
    {
      username: 'eude',
      password: '603',
      isValid: (y, m) => isOdd(y) && [3, 4, 5, 6, 7, 8].includes(m),
      description: 'tháng 3, 4, 5, 6, 7, 8 năm lẻ'
    },
    {
      username: 'cbon',
      password: '604',
      isValid: (y, m) => isOdd(y) && [4, 5, 6, 7, 8, 9].includes(m),
      description: 'tháng 4, 5, 6, 7, 8, 9 năm lẻ'
    },
    {
      username: 'dzon',
      password: '605',
      isValid: (y, m) => isOdd(y) && [5, 6, 7, 8, 9, 10].includes(m),
      description: 'tháng 5, 6, 7, 8, 9, 10 năm lẻ'
    },
    {
      username: 'gduc',
      password: '606',
      isValid: (y, m) => isOdd(y) && [6, 7, 8, 9, 10, 11].includes(m),
      description: 'tháng 6, 7, 8, 9, 10, 11 năm lẻ'
    },
    {
      username: 'nzuy',
      password: '607',
      isValid: (y, m) => isOdd(y) && [7, 8, 9, 10, 11, 12].includes(m),
      description: 'tháng 7, 8, 9, 10, 11, 12 năm lẻ'
    },
    {
      username: 'zegv',
      password: '608',
      isValid: (y, m) => (isOdd(y) && [8, 9, 10, 11, 12].includes(m)) || (isEven(y) && m === 1),
      description: 'tháng 8, 9, 10, 11, 12 năm lẻ và tháng 1 năm chẵn'
    },
    {
      username: 'oeux',
      password: '609',
      isValid: (y, m) => (isOdd(y) && [9, 10, 11, 12].includes(m)) || (isEven(y) && [1, 2].includes(m)),
      description: 'tháng 9, 10, 11, 12 năm lẻ và tháng 1, 2 năm chẵn'
    },
    {
      username: 'zude',
      password: '610',
      isValid: (y, m) => (isOdd(y) && [10, 11, 12].includes(m)) || (isEven(y) && [1, 2, 3].includes(m)),
      description: 'tháng 10, 11, 12 năm lẻ và tháng 1, 2, 3 năm chẵn'
    },
    {
      username: 'gxae',
      password: '611',
      isValid: (y, m) => (isOdd(y) && [11, 12].includes(m)) || (isEven(y) && [1, 2, 3, 4].includes(m)),
      description: 'tháng 11, 12 năm lẻ và tháng 1, 2, 3, 4 năm chẵn'
    },
    {
      username: 'zgez',
      password: '612',
      isValid: (y, m) => (isOdd(y) && m === 12) || (isEven(y) && [1, 2, 3, 4, 5].includes(m)),
      description: 'tháng 12 năm lẻ và tháng 1, 2, 3, 4, 5 năm chẵn'
    },

    // Nhóm chẵn chủ đạo
    {
      username: 'zeub',
      password: '601',
      isValid: (y, m) => isEven(y) && [1, 2, 3, 4, 5, 6].includes(m),
      description: 'tháng 1, 2, 3, 4, 5, 6 năm chẵn'
    },
    {
      username: 'vuac',
      password: '602',
      isValid: (y, m) => isEven(y) && [2, 3, 4, 5, 6, 7].includes(m),
      description: 'tháng 2, 3, 4, 5, 6, 7 năm chẵn'
    },
    {
      username: 'uden',
      password: '603',
      isValid: (y, m) => isEven(y) && [3, 4, 5, 6, 7, 8].includes(m),
      description: 'tháng 3, 4, 5, 6, 7, 8 năm chẵn'
    },
    {
      username: 'gveu',
      password: '604',
      isValid: (y, m) => isEven(y) && [4, 5, 6, 7, 8, 9].includes(m),
      description: 'tháng 4, 5, 6, 7, 8, 9 năm chẵn'
    },
    {
      username: 'gaud',
      password: '605',
      isValid: (y, m) => isEven(y) && [5, 6, 7, 8, 9, 10].includes(m),
      description: 'tháng 5, 6, 7, 8, 9, 10 năm chẵn'
    },
    {
      username: 'zdun',
      password: '606',
      isValid: (y, m) => isEven(y) && [6, 7, 8, 9, 10, 11].includes(m),
      description: 'tháng 6, 7, 8, 9, 10, 11 năm chẵn'
    },
    {
      username: 'cxon',
      password: '607',
      isValid: (y, m) => isEven(y) && [7, 8, 9, 10, 11, 12].includes(m),
      description: 'tháng 7, 8, 9, 10, 11, 12 năm chẵn'
    },
    {
      username: 'anug',
      password: '608',
      isValid: (y, m) => (isEven(y) && [8, 9, 10, 11, 12].includes(m)) || (isOdd(y) && m === 1),
      description: 'tháng 8, 9, 10, 11, 12 năm chẵn và tháng 1 năm lẻ'
    },
    {
      username: 'xzun',
      password: '609',
      isValid: (y, m) => (isEven(y) && [9, 10, 11, 12].includes(m)) || (isOdd(y) && [1, 2].includes(m)),
      description: 'tháng 9, 10, 11, 12 năm chẵn và tháng 1, 2 năm lẻ'
    },
    {
      username: 'zden',
      password: '610',
      isValid: (y, m) => (isEven(y) && [10, 11, 12].includes(m)) || (isOdd(y) && [1, 2, 3].includes(m)),
      description: 'tháng 10, 11, 12 năm chẵn và tháng 1, 2, 3 năm lẻ'
    },
    {
      username: 'udoz',
      password: '611',
      isValid: (y, m) => (isEven(y) && [11, 12].includes(m)) || (isOdd(y) && [1, 2, 3, 4].includes(m)),
      description: 'tháng 11, 12 năm chẵn và tháng 1, 2, 3, 4 năm lẻ'
    },
    {
      username: 'degn',
      password: '612',
      isValid: (y, m) => (isEven(y) && m === 12) || (isOdd(y) && [1, 2, 3, 4, 5].includes(m)),
      description: 'tháng 12 năm chẵn và tháng 1, 2, 3, 4, 5 năm lẻ'
    }
  ];
  
  const enterFullScreen = () => {
    const element = document.documentElement;
    const doc = document as any;

    // Check if already in full screen to avoid console warnings
    const isFullScreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;
    if (isFullScreen) return;

    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
    } else if ((element as any).webkitRequestFullscreen) { /* Safari */
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) { /* IE11 */
      (element as any).msRequestFullscreen();
    }
  };

  // Force full screen interaction
  useEffect(() => {
    if (isAuthenticated) {
      const maintainFullScreen = () => {
        enterFullScreen();
      };

      // Try immediately
      enterFullScreen();

      // Add listeners to re-trigger full screen on any user interaction
      document.addEventListener('click', maintainFullScreen);
      document.addEventListener('touchstart', maintainFullScreen);
      document.addEventListener('keydown', maintainFullScreen);

      return () => {
        document.removeEventListener('click', maintainFullScreen);
        document.removeEventListener('touchstart', maintainFullScreen);
        document.removeEventListener('keydown', maintainFullScreen);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    
    // Automatically save username and password on first attempt for next time
    const trimmedUsername = username.trim();
    localStorage.setItem('saved-username', trimmedUsername);
    localStorage.setItem('saved-password', password);
    
    const user = USERS.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (!user) {
      setError('Tên đăng nhập không tồn tại.');
      return;
    }

    if (user.password !== password) {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPassword('');
      return;
    }

    // Check dynamic expiration/validity based on year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-indexed

    if (!user.isValid(currentYear, currentMonth)) {
      setError('Tài khoản hết bạn');
      return;
    }

    setIsAuthenticated(true);
    enterFullScreen();
    setError('');
  };

  const handleLessonClick = (lessonNumber: number) => {
    if (apiKey) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speechText = `Chúng ta cùng giao tiếp Bài ${lessonNumber + 13}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'vi-VN';
        window.speechSynthesis.speak(utterance);
      }
      setActiveLesson(lessonNumber);
    }
  };

  const handleEndChat = () => {
    setActiveLesson(null);
  };

  const handleSaveApiKey = (newKey: string) => {
    const trimmedKey = newKey.trim();
    if (trimmedKey) {
      localStorage.setItem('gemini-api-key', trimmedKey);
      setApiKey(trimmedKey);
    } else {
      localStorage.removeItem('gemini-api-key');
      setApiKey(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-sky-100 min-h-dvh w-full flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm border-8 border-orange-400 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-center text-orange-600 mb-2 drop-shadow-md">
            AI Giao Tiếp
          </h1>
          <h2 className="text-xl font-bold text-center text-blue-700 mb-6 drop-shadow">
            Vui lòng đăng nhập
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4 text-left">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên đăng nhập"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-base"
                aria-label="Username Input"
                autoFocus
              />
            </div>
            <div className="mb-4 text-left">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-base"
                aria-label="Password Input"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 active:scale-95"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-sky-100 min-h-dvh w-full">
      <div className="bg-white/70 backdrop-blur-sm border-8 border-orange-400 p-4 w-full min-h-dvh flex flex-col items-center justify-start box-border">
        
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-700 mb-0 drop-shadow">
            TIẾNG TRUNG THÔNG MINH
          </h2>
          
          <div className="relative w-full max-w-4xl flex items-center justify-center mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-orange-600 drop-shadow-md -mt-1">
              AI giao tiếp
            </h1>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
              <ApiKeyInput onSave={handleSaveApiKey} />
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto w-full max-w-full gap-2 pb-3 px-4 justify-start md:justify-center items-center scroll-smooth">
            {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNumber) => (
              <LessonButton 
                key={lessonNumber} 
                lessonNumber={lessonNumber} 
                onClick={handleLessonClick}
                disabled={!apiKey}
              />
            ))}
          </div>
        </div>

        {activeLesson && apiKey && (
          <div className="w-full mt-4 flex-grow flex flex-col">
            <ChatView 
              lessonNumber={activeLesson} 
              lessonTitle={lessonTitles[activeLesson - 1]}
              onEndChat={handleEndChat} 
              apiKey={apiKey}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
