 export function allProject
 return ( 
    <div className="px-15 bg-gradient-to-r from-black to-blue-800 text-gray-200 p-4">
      <ProfileHeader userInfo={userInfo} />
      <div className="flex flex-wrap h-fit items-center">
          <LevelCircle level={level} />
          <XpCursusCard xpCursus={xpCursus} />
      </div>

      <CursusCards cursus={cursus} />

      <div className="pb-6">
        <CursusInfoTable cursusInfo={cursusInfo} />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-8">
        <div className="flex flex-wrap h-fit items-center">
            <AuditRatioCard userInfo={userInfo} />
            <WhatsUpCard lastProject={lastProject} />
        </div>
        <RecentAuditsList audits={audits} />
      </section>

      <BestSkillsRadar />
      <XpProgressChart transactions={transactions} />
    </div>
  );
}
