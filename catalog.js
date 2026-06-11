// Initial catalog — files from music/ folder
const INITIAL_TRACKS = [
  { id: "t1", file: "Honey bee & joker-ndafunga.mp3", title: "Ndafunga", artist: "Honey Bee & Joker Di Genius", category: "collab", uploaded: "2025-08-12" },
  { id: "t2", file: "Honey Bee ft Joker Di_Electric fish .mp3", title: "Electric Fish", artist: "Honey Bee ft Joker Di Genius", category: "collab", uploaded: "2025-07-20" },
  { id: "t3", file: "Honey Bee ft Shellaz & Joker Di Genius - Rolling(Prod By KSG Di Don).mp3", title: "Rolling", artist: "Honey Bee ft Shellaz & Joker Di Genius", category: "dancehall", uploaded: "2025-09-05" },
  { id: "t4", file: "Joker Di Genius x Honey Bee-Dance around .mp3", title: "Dance Around", artist: "Joker Di Genius x Honey Bee", category: "dancehall", uploaded: "2025-10-01" },
  { id: "t5", file: "Joker Di Genius x Honey Bee_Ndichifa.wav", title: "Ndichifa", artist: "Joker Di Genius x Honey Bee", category: "collab", uploaded: "2025-11-15" },
  { id: "t6", file: "Joker Di Genius-Never Easy Master.mp3", title: "Never Easy", artist: "Joker Di Genius", category: "hiphop", uploaded: "2025-06-18" },
  { id: "t7", file: "Joker Di Genius-Zvikuzikanwa .mp3", title: "Zvikuzikanwa", artist: "Joker Di Genius", category: "hiphop", uploaded: "2025-05-22" },
  { id: "t8", file: "JOKER diGENIUS-FATHER GOD.mp3", title: "Father God", artist: "Joker Di Genius", category: "gospel", uploaded: "2025-12-01" },
  { id: "t9", file: "joker-di-genius_cella_type-yako-feat-joker-di-genius-prod-by-x-fecta-for-soundmindz.mp3", title: "Type Yako", artist: "Cella feat. Joker Di Genius", category: "hiphop", uploaded: "2025-04-10" },
  { id: "t10", file: "joker-di-genius_f_i_o_ft_joker_di_genius_number_one.mp3", title: "Number One", artist: "F.I.O ft Joker Di Genius", category: "collab", uploaded: "2025-03-28" },
  { id: "t11", file: "joker-di-genius_jocker-di-genius-i-cry-tribute-to-di-apprentice.mp3", title: "I Cry (Tribute to Di Apprentice)", artist: "Joker Di Genius", category: "tribute", uploaded: "2025-02-14" },
  { id: "t12", file: "joker-di-genius_joker-d-genius-gwan-talk.mp3", title: "Gwan Talk", artist: "Joker Di Genius", category: "dancehall", uploaded: "2025-01-20" },
  { id: "t13", file: "joker-di-genius_joker-di-genius-ft-mazhambe-jnr-king-mafaro-madlevel-riddim-levels-chillspot-n-legendary-music-prod.mp3", title: "Madlevel Riddim", artist: "Joker Di Genius ft Mazhambe Jnr & King Mafaro", category: "riddim", uploaded: "2025-08-30" },
  { id: "t14", file: "joker-di-genius_joker-di-genius-gel-dem-want-me-prod-by-x-fecta.mp3", title: "Gel Dem Want Me", artist: "Joker Di Genius", category: "dancehall", uploaded: "2025-07-08" },
  { id: "t15", file: "joker-di-genius_joker-di-genius-h-t-f-da-shocca-tiri-kutyisa__prod-by-trinnie-beatz-angeo-pablo-_zayaan-empire-records (1).mp3", title: "Tiri Kutyisa", artist: "Joker Di Genius, H.T.F & Da Shocca", category: "collab", uploaded: "2025-09-18" },
  { id: "t16", file: "joker-di-genius_joker-di-genius-money-friend.mp3", title: "Money Friend", artist: "Joker Di Genius", category: "hiphop", uploaded: "2025-06-05" },
  { id: "t17", file: "joker-di-genius_joker-di-genius-nuh-new-friend.mp3", title: "Nuh New Friend", artist: "Joker Di Genius", category: "hiphop", uploaded: "2025-05-15" },
  { id: "t18", file: "joker-di-genius_joker-di-genius-usade-kundisaiza-password-riddim-prod-by-kutso (1).mp3", title: "Usade Kundisaiza", artist: "Joker Di Genius", category: "riddim", uploaded: "2025-10-22" },
  { id: "t19", file: "joker-di-genius_joker-real-champion-champion-taks-riddim-pro-by-kutso-warrior-music (1).mp3", title: "Real Champion", artist: "Joker Di Genius", category: "riddim", uploaded: "2025-11-08" },
  { id: "t20", file: "joker-di-genius_petitions-riddim_jocker-di-genius_tichaitasei_prod-by-jeeperz-jmp-0774695719.mp3", title: "Tichaitasei", artist: "Joker Di Genius", category: "riddim", uploaded: "2025-12-10" },
  { id: "t21", file: "joker-di-genius_softaz-ft-joker-di-genius-ghetto-jnr-handimire-ngoma-password-riddim-prod-by-kutso.mp3", title: "Handimire Ngoma", artist: "Softaz ft Joker Di Genius & Ghetto Jnr", category: "riddim", uploaded: "2025-12-20" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "dancehall", label: "Dancehall" },
  { id: "riddim", label: "Riddim" },
  { id: "hiphop", label: "Hip Hop" },
  { id: "collab", label: "Collaborations" },
  { id: "gospel", label: "Gospel" },
  { id: "tribute", label: "Tribute" },
];

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/jokerdigenius",
  instagram: "https://www.instagram.com/joker_di_genius?igsh=c2VuaWp5ZGFhd3pi&utm_source=qr",
  youtube: "https://youtube.com/@jokerdigenius?si=FWjkM5-N358hU5PF",
  tiktok: "https://www.tiktok.com/@jokerdigenius?_t=8kYvxQOHShq&_r=1",
  phone: "+447917431957",
  whatsapp: "https://wa.me/447917431957",
};
