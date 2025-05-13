"use client";
import { useState } from "react";


interface UserAttrs {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    country: string;
    addressStreet: string;
    addressComplementStreet: string;
    addressPostalCode: string;
    addressCity: string;
    addressCountry: string;
    email: string;
    Phone: string;
    emergencyFirstName: string;
    emergencyLastName: string;
    emergencyAffiliation: string;
    emergencyTel: string;
  }
interface UserInfo {
    login: string;
    totalUp: number;
    totalDown: number;
    attrs: UserAttrs;
  }
  

interface UserInfoPanelProps {
  user: UserInfo;
}

export default function UserInfoPanel({ user }: UserInfoPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { attrs } = user;
  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: "Additional informations",
      content: (
        <div className="space-y-1">
          <p><strong>Nom :</strong> {attrs.lastName}</p>
          <p><strong>Prénom :</strong> {attrs.firstName}</p>
          <p><strong>Genre :</strong> {attrs.gender}</p>
          <p><strong>Date de naissance :</strong> {new Date(attrs.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Lieu de naissance :</strong> {attrs.placeOfBirth}</p>
          <p><strong>Nationalité :</strong> {attrs.country}</p>
          <p><strong>Adresse :</strong> {attrs.addressStreet}, {attrs.addressComplementStreet}, {attrs.addressPostalCode} {attrs.addressCity}, {attrs.addressCountry}</p>
          <p><strong>Téléphone :</strong> {attrs.Phone}</p>
        </div>
      ),
    },
    {
      title: "Medical informations",
      content: (
        <div className="space-y-1">
          <p><strong>Nom :</strong> {attrs.emergencyLastName}</p>
          <p><strong>Prénom :</strong> {attrs.emergencyFirstName}</p>
          <p><strong>Lien :</strong> {attrs.emergencyAffiliation}</p>
          <p><strong>Téléphone :</strong> {attrs.emergencyTel}</p>
        </div>
      ),
    },
    {
      title: "Change password",
      content: <p>Fonctionnalité à venir...</p>,
    },
    {
      title: "Change email",
      content: <p>Email actuel : {attrs.email}</p>,
    },
  ];

  return (
    <div className="absolute left-15 top-14.5 bg-black text-white p-6 max-w-xl mx-auto rounded-lg shadow-lg bg-opacity-50 z-11 border ">
      <div className="mb-6">
        <h2 className="text-2xl font-bold uppercase">
          {attrs.firstName} {attrs.lastName}
        </h2>
        <p className="text-sm text-gray-400 font-mono">#{user.login}</p>
      </div>

      <p className="text-sm text-gray-400 mb-4">Dites-nous en plus à votre sujet</p>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full text-left py-3 px-4 bg-gray-900 hover:bg-gray-800 rounded transition flex justify-between items-center"
            >
              <span>{section.title}</span>
              <span>{openIndex === index ? "▾" : "▸"}</span>
            </button>
            {openIndex === index && (
              <div className="bg-gray-800 px-4 py-3 rounded-b text-sm text-gray-300">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
