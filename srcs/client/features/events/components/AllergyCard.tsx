// import { CircleAlert } from 'lucide-react';
// import type { Participant } from '@/app/types';
// import { Badge } from '@/components/ui/Badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { getDisplayName } from '@/features/users/lib/profile';

// const renderAllergyTags = (userId: string, allergies: string[]) => {
//   if (allergies.length <= 3) {
//     return allergies.map((allergy) => (
//       <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
//         {allergy}
//       </Badge>
//     ));
//   }

//   return (
//     <>
//       {allergies.slice(0, 3).map((allergy) => (
//         <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
//           {allergy}
//         </Badge>
//       ))}
//       <Badge variant='destructive' size='sm'>
//         +{allergies.length - 3}
//       </Badge>
//     </>
//   );
// };

// export const AllergyCard = (participant: Participant) => {
//   return allergyEntries.length > 0 ? (
//     <Card variant='destructive' className='gap-2'>
//       <CardHeader className='gap-2'>
//         <CircleAlert className='size-4' />
//         <CardTitle>アレルギー情報</CardTitle>
//       </CardHeader>
//       <CardContent className='gap-2'>
//         {allergyEntries.map(({ allergies, participant }) => (
//           <Card
//             key={`allergy-${participant.user_id}`}
//             size='sm'
//             variant='default shadow-none'
//           >
//             <CardContent className='flex-row items-center text-foreground'>
//               <span className='mr-auto text-foreground'>
//                 {getDisplayName(participant.profiles)}
//               </span>
//               <span className='ml-auto flex flex-wrap justify-end gap-2'>
//                 {renderAllergyTags(participant.user_id, allergies)}
//               </span>
//             </CardContent>
//           </Card>
//         ))}
//       </CardContent>
//     </Card>
//   ) : null;
// };
