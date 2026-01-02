import Image from "next/image";
import { Service } from "./Service";
import style from '@/styles/Links.module.css'

export default function QuickLinkCard({ service }: { service: Service }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group p-4 shadow-sm transition hover:shadow-md hover:bg-default-50 no-underline ${style.LinkContainer}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src={service.icon}
          alt={service.name}
          width={48}
          height={48}
          className="rounded-md"
        />

        <div className="max-w-full">
          <h3 className={`font-medium leading-tight ${style.text}`}>
            {service.name}
          </h3>
          {service.description && (
            <p className={`text-sm leading-tight ${style.text}`}>
              {service.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
