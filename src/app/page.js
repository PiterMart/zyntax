"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Video from '../components/Video';
import LogoButton from '../components/LogoButton';
import UIOverlay from '../components/UIOverlay';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isUIOpen, setIsUIOpen] = useState(false);

  useEffect(() => {
    // Simulate initial content loading (minimum 5 seconds)
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogoClick = () => {
    setIsUIOpen(true);
  };

  const handleCloseUI = () => {
    setIsUIOpen(false);
  };
  useEffect(() => {
    console.log(`
                                          :~7???7!:.                                                
                                      :!YGBGPYYY5GBB57:                                             
                                  .~JPBB57:       :!YGBGJ!.                                         
                              .^?PBBP?^.              ^75BBP?~.                                     
                           :75BBGJ~.      .^?Y5Y?~.      .~JPBB57^                                  
                        ~JGBGY!:       :!YG#&&##&#B57^       :!YGBGY!.                              
                      !G#P7^       :!JP#&&##########&#GY!:       :75#B7                             
                     J&G~       ~?PB#&#################&#BPJ~.      ^P&5.                           
                    7&B:      ^G#&#########################&#G~      .G&J                           
                    Y&Y       Y&#############################&P       J&P                           
                    Y&Y       Y&##############################P       ?&P                           
                    Y&Y       Y&##############################P       ?&P                           
                    Y&Y       Y&##############################P       ?&P                           
                    Y&Y       Y&##############################P       ?&P                           
                    Y&Y       Y&##############################P       ?&P                           
                    Y&Y       Y&###########&&&&&&&############P       ?&P                           
                    Y&Y       7#&########BPY?7!7?J5B#&######&&J       ?&P                           
                    Y&Y        ~YG#&###5!.   ...   .~Y###&#GY!        ?&P                           
                    Y&5           ^75P~  .75GBBBG5?:  ^P5?^.          J&P                           
                    ~##~                !B&#######&B7                ^B&7                           
                     7##?.             :#############~             .7B#?                            
                      :Y#B57^          ^############&!          :!YB#5^                             
                        .!YGBGY!:       J#&########&5.      .~JGBGY!:                               
                            :75BBPJ~.    ~5B#####B5!    .^?PBB57^                                   
                               .^?PBBP?^.  .^~!~^.   ^75BBPJ~.                                       
                                   .~JGBB57:.   .:!YGBGY!:                                           
                                       :!YGBGGGGGBG57:                                               
                                           .^~~~^:                                                   
                                                                                                    
                                                                                                    
                                                                                                    
   Y!            :5^  :5YJJJJJJJJJY~ :JY^         .?Y~         ^55^                                 
   &J            ^@!  ~@~.........:.  .?GP!     ^JGJ^         ?#7?#?                                
   #J            ^@!  ^@^                ~PG7.~5P7.         .5B^  ^BP.                              
   #GJJJJJJJJJJJJY@!  ^@5JJJJJJJJ:         ~#&@?           ^BY      5B^                             
   #J            ^@!  ^@~ .......        ^YP?:7PP!        ?@P!!!!!!!!G@?      .    ..    .    .     
   &J            ^@!  ~@^             .!PP7.    ~PG?:   .PG~^~~~~~~~~^~BP.  :~:^^:~::!.7^^!^7::~^   
   P7            :B~  ^BYJJJJJJJJJY! ^55~         ^YP! .5Y             .55. :~:^^:~::!:7  .^J::~^ : 
                         ..........  .               .                        ..   ..      .^ .  
    
    developed by Zyntax, Pedro martingaste and https://www.instagram.com/zyntax_xx/
    `);
  }, []);

  return (
    <main>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} isLoading={!contentLoaded} />}

      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        {/* Video background with footer */}
        <Video>
          {/* Logo button to open UI overlay */}
          {!isUIOpen && <LogoButton onClick={handleLogoClick} />}
          
          {/* UI Overlay on first 100vh */}
          <UIOverlay isOpen={isUIOpen} onClose={handleCloseUI} />
        </Video>
      </div>
    </main>
  );
}
