'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface StarBurstProps {
  isVisible: boolean;
}

const StarBurst: React.FC<StarBurstProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-burst"
          style={{
            left: '50%',
            top: '50%',
            animation: `burst 1s ease-out forwards ${Math.random() * 0.5}s`,
            transform: `rotate(${i * 18}deg) translateY(-100px)`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};

const giftCards = [
  { id: 1, name: "Santa's Magic", description: "May Santa bring joy and light with a tree full of Christmas magic!" },
  { id: 2, name: "Snowflake Joy", description: "Unwrap the holiday cheer as snowflakes and presents brighten your heart!" },
  { id: 3, name: "Santa's Bounty", description: "Let Santa fill your world with gifts, warmth, and endless joy this season!" },
  { id: 4, name: "Frosty's Cheer", description: "Embrace the holiday spirit with a snowman, bringing frosty fun and smiles!" },
  { id: 5, name: "Stocking Wonder", description: "Stockings full of love and festive surprises await to make your Christmas bright!" },
  { id: 6, name: "Jingle Delight", description: "Ring the bells of joy and unwrap the wonders of Christmas with festive delight!" }
];

const GiftCardModal: React.FC<{ isOpen: boolean; onClose: () => void; collectedCards: Record<number, number> }> = ({ isOpen, onClose, collectedCards }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Your Festive Collection</h2>
        <div className="grid grid-cols-3 gap-2">
          {giftCards.map((card) => (
            <div key={card.id} className="flex flex-col items-center bg-green-100 p-2 rounded-lg">
              <Image
                src={`/giftcards/${card.id}.jpg`}
                alt={card.name}
                width={60}
                height={60}
                className="rounded-lg shadow-md"
              />
              <p className="mt-1 text-xs font-semibold text-green-800 text-center">{card.name}</p>
              <p className="text-lg font-bold text-red-600">{collectedCards[card.id] || 0}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

const DailyChest: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [showStars, setShowStars] = useState<boolean>(false);
  const [newCoins, setNewCoins] = useState<number>(0);
  const [openCount, setOpenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [giftCard, setGiftCard] = useState<{ id: number, name: string, description: string } | null>(null);
  const [collectedCards, setCollectedCards] = useState<Record<number, number>>({});
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    const storedOpenCount = localStorage.getItem('openCount');
    const storedCards = localStorage.getItem('collectedCards');
    if (storedCoins) setCoins(parseInt(storedCoins));
    if (storedOpenCount) setOpenCount(parseInt(storedOpenCount));
    if (storedCards) setCollectedCards(JSON.parse(storedCards));
  }, []);

  const playAudio = (filename: string) => {
    const audio = new Audio(filename);
    audio.play().catch(error => console.error('Audio playback failed', error));
  };

  const handleOpenChest = () => {
    if (openCount >= 10) return;

    setIsLoading(true);
    playAudio('/openingsound.mp3');

    setTimeout(() => {
      const isGiftCard = Math.random() < 0.3; // 30% chance of getting a gift card
      const updatedOpenCount = openCount + 1;

      if (isGiftCard) {
        const randomGiftCard = giftCards[Math.floor(Math.random() * giftCards.length)];
        setGiftCard(randomGiftCard);
        setNewCoins(0);
        const updatedCollectedCards = {
          ...collectedCards,
          [randomGiftCard.id]: (collectedCards[randomGiftCard.id] || 0) + 1
        };
        setCollectedCards(updatedCollectedCards);
        localStorage.setItem('collectedCards', JSON.stringify(updatedCollectedCards));
      } else {
        const coinsToAdd = Math.floor(Math.random() * 901) + 100; // Random between 100 and 1000
        const updatedCoins = coins + coinsToAdd;
        setCoins(updatedCoins);
        setNewCoins(coinsToAdd);
        setGiftCard(null);
        localStorage.setItem('coins', updatedCoins.toString());
      }

      setChestOpened(true);
      setShowStars(true);
      setOpenCount(updatedOpenCount);
      setIsLoading(false);

      localStorage.setItem('openCount', updatedOpenCount.toString());

      if (updatedOpenCount === 10) {
        playAudio('/congratulations.mp3');
      } else {
        playAudio('/goodresult.mp3');
      }

      setTimeout(() => {
        setChestOpened(false);
        setShowStars(false);
        setNewCoins(0);
        setGiftCard(null);
      }, 5000);
    }, 3000); // 3 second delay for dramatic effect
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/snowflakes.png')] opacity-30 animate-fall"></div>
      
      <div className="flex flex-col items-center z-20 w-full max-w-md">
        <div className="w-full flex justify-between items-start mb-4">
          <div className="text-2xl font-bold text-white text-shadow-lg">
            🪙 {coins}
          </div>
          <button
            onClick={() => setIsGiftCardModalOpen(true)}
            className="relative w-16 h-16 transition-transform duration-300 hover:scale-110"
          >
            {[2, 1, 0].map((index) => (
              <div
                key={index}
                className="absolute w-12 h-12 bg-white rounded-lg shadow-md"
                style={{
                  top: `${index * 4}px`,
                  left: `${index * 4}px`,
                  zIndex: 3 - index,
                  backgroundImage: `url(/giftcards/${(index % 6) + 1}.jpg)`,
                  backgroundSize: 'cover',
                  transform: `rotate(${index * 5}deg)`,
                }}
              />
            ))}
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-8 text-center text-shadow-lg">
          🎄 Mystery Box 🎁
        </h1>
        
        <AnimatePresence>
          {giftCard ? (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
              className="mb-4 flex flex-col items-center"
            >
              <Image
                src={`/giftcards/${giftCard.id}.jpg`}
                alt="Gift Card"
                width={200}
                height={200}
                className="object-cover rounded-lg shadow-2xl"
              />
              <p className="mt-2 text-lg font-bold text-yellow-300 text-center text-shadow-lg">
                {giftCard.name}
              </p>
              <p className="mt-1 text-sm sm:text-base text-white text-center max-w-md italic text-shadow-lg">
                &ldquo;{giftCard.description}&rdquo;
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="relative mb-4"
              animate={chestOpened ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            >
              <Image
                src={chestOpened ? "/open-chest.png" : "/closed-chest.png"}
                alt="Mystery Box"
                width={240}
                height={240}
                className="object-contain filter drop-shadow-2xl"
              />
              <AnimatePresence>
                {chestOpened && newCoins > 0 && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-6xl sm:text-8xl animate-bounce">🪙</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <StarBurst isVisible={showStars} />

        <AnimatePresence>
          {newCoins > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 sm:mt-4 text-3xl sm:text-5xl font-bold text-yellow-300 z-30 text-shadow-lg"
            >
              +{newCoins} 🪙
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleOpenChest}
          disabled={openCount >= 10 || isLoading}
          className={`mt-4 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full font-bold text-xl sm:text-2xl shadow-lg transition duration-300 transform hover:scale-105 ${
            openCount >= 10 ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-500 hover:to-yellow-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Unwrapping Magic...
            </span>
          ) : (
            'Open Mystery Box'
          )}
        </button>

        <div className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-white text-shadow-lg text-center">
          <span className="text-yellow-300">✨</span> Magical Surprises Remaining: {10 - openCount} <span className="text-yellow-300">✨</span>
        </div>
      </div>

      <AnimatePresence>
        {isGiftCardModalOpen && (
          <GiftCardModal
            isOpen={isGiftCardModalOpen}
            onClose={() => setIsGiftCardModalOpen(false)}
            collectedCards={collectedCards}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DailyChest;
