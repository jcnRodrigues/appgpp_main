/* eslint-disable @next/next/no-img-element */

import { PatrimonioGP } from '@/features/patrimonio/server/models/PatrimonioGP.model';
import { getPatrimonioCardById } from '@/features/patrimonio/server/patrimonio.service';
import { ArrowUpRight, Star } from 'lucide-react';
import Link from 'next/link';

export default async function PatrimonioCard({ idP, idStatusPat }: PatrimonioGP) {
  const patrimonio = await getPatrimonioCardById(idP);

  if (patrimonio === null) {
    return <div>Patrimônio não encontrado</div>;
  }

  return (
    <Link href={`/patrimoniolist/patrimonio/${idP}`}>
      <div className="relative mb-7 rounded-3xl bg-white p-3">
        <div className="relative">
          <img
            src={`https://placehold.co/600x400?text=00${patrimonio?.idPat}`}
            alt="Patrimônio"
            width={200}
            height={300}
            className="h-40 w-full rounded-2xl object-cover"
          />
          <div className="absolute bottom-3 right-2 flex items-center rounded-full bg-white px-3 py-1">
            <Star className="h-4 w-4 fill-accent text-accent-foreground" />
          </div>
        </div>

        <div className="mb-3 px-4 pb-4 pt-2 text-center">
          <h3 className="mb-1 truncate text-h4 whitespace-nowrap overflow-hidden">
            {patrimonio?.tbTipoPat?.descricaoTipPat} - {patrimonio?.idPat}
          </h3>
          <p>{patrimonio?.descricaoPat}</p>
          <p>{patrimonio?.valorPat?.toString()}</p>
          <p>{patrimonio?.tbCCusto?.descricaoCCusto}</p>

          <span
            className={`text-medium rounded-full px-2 py-1 text-xs font-semibold ${
              idStatusPat === 'ATIVO'
                ? 'bg-green-100 text-green-800'
                : idStatusPat === 'INATIVO'
                  ? 'bg-red-100 text-red-800'
                  : idStatusPat === 'PENDENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : idStatusPat === 'MANUTENÇÃO'
                      ? 'bg-orange-100 text-orange-800'
                      : idStatusPat === 'TRANSFERIDO'
                        ? 'bg-blue-100 text-blue-800'
                        : idStatusPat === 'DEVOLUÇÃO'
                          ? 'bg-gray-100 text-gray-800'
                          : idStatusPat === 'RESERVA'
                            ? 'bg-purple-100 text-purple-800'
                            : idStatusPat === 'INDENIZADO'
                              ? 'bg-purple-100 text-black-800'
                              : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {idStatusPat}
          </span>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 transform">
          <button className="rounded-full bg-accent p-2 text-white">
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
